import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@vercel/postgres";
import { Redis } from "@upstash/redis";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  const { departureId, seats, customer, amountCOP } = await req.json();
  // Validar: asientos aún LOCKED y no expirados
  // (si alguno no está bloqueado -> error)

  // Crear orden PENDING
  const { rows } = await sql`
    INSERT INTO orders (customer_name, customer_phone, email, total_cop, payment_status, payment_provider)
    VALUES (${customer?.name||null}, ${customer?.phone||null}, ${customer?.email||null}, ${amountCOP}, 'PENDING', 'stripe')
    RETURNING *;
  `;
  const order = rows[0];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "cop",
          product_data: { name: `Tiquetes (${seats.length})` },
          unit_amount: Math.round(amountCOP / seats.length),
        },
        quantity: seats.length,
      },
    ],
    success_url: `${process.env.PUBLIC_URL}/success?order=${order.id}`,
    cancel_url: `${process.env.PUBLIC_URL}/cancel?order=${order.id}`,
    metadata: { orderId: order.id, departureId, seats: seats.join(",") },
  });

  return NextResponse.json({ orderId: order.id, checkoutUrl: session.url });
}
