import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@vercel/postgres";
import { Redis } from "@upstash/redis";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(raw, sig, endpointSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId!;
    const departureId = session.metadata?.departureId!;
    const seats = (session.metadata?.seats || "").split(",").filter(Boolean);

    // 1) Marcar orden como PAID
    await sql`UPDATE orders SET payment_status='PAID', provider_ref=${session.id} WHERE id=${orderId};`;

    // 2) Pasar INVENTORY a SOLD + liberar locks
    await sql`
      UPDATE inventory 
      SET status='SOLD', order_id=${orderId}, locked_until=NULL
      WHERE departure_id=${departureId} AND seat_code = ANY(${seats});
    `;
    // limpiar locks redis
    for (const seat of seats) {
      await redis.del(`lock:${departureId}:${seat}`);
    }

    // 3) Guardar detalle seats (order_seats)
    const values = seats.map(
      (s) => sql`(${orderId}::uuid, ${departureId}::uuid, ${s}, 
                   (SELECT price_cop FROM routes r 
                      JOIN departures d ON d.route_id=r.id 
                     WHERE d.id=${departureId} LIMIT 1))`
    );
    if (values.length) {
      await sql`INSERT INTO order_seats (order_id, departure_id, seat_code, price_cop) VALUES ${sql.join(values, sql`,`)}`;
    }

    // 4) (Opcional) enviar email con Resend / WhatsApp con Twilio
  }

  return NextResponse.json({ received: true });
}
