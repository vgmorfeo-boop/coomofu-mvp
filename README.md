# Coomofu MVP – Intermunicipal Tickets (Demo)

Demo lista para desplegar en **Vercel**. Incluye:

- Next.js (App Router) + Tailwind CSS
- Búsqueda de buses por **origen/destino/fecha**
- Listado de salidas con precio, duración y **asientos disponibles**
- **Selector de asientos** (demo)
- **Checkout** con métodos de pago simulados (PSE / Nequi / Daviplata / Tarjeta)
- Páginas informativas (About, Tours placeholder)

> Datos mock en `lib/data/trips.ts` y `searchTrips()`

## 🚀 Ejecutar en local

```bash
npm install
npm run dev
# abre http://localhost:3000
```

## ☁️ Desplegar en Vercel

1. Crea un repositorio (GitHub/GitLab/Bitbucket).
2. Sube el contenido de este proyecto.
3. Entra a [vercel.com](https://vercel.com), **Import Project** y sigue el wizard.
4. Variables de entorno **no son necesarias** (demo sin backend).
5. Build command: `npm run build` · Output: `.next`

## 🧩 Estructura

```
app/
  page.tsx          -> Landing + formulario de búsqueda
  search/page.tsx   -> Resultados de buses
  trip/[id]/page.tsx-> Selección de asientos
  checkout/page.tsx -> Resumen y pago (simulado)
  about/page.tsx    -> Información de la demo
  tours/page.tsx    -> Placeholder de tours
components/
  SearchForm.tsx
  TripCard.tsx
  SeatPicker.tsx
lib/
  data/trips.ts     -> Estaciones y viajes mock + helpers
```

## 📦 Siguientes pasos (post-demo)

- Conectar a **Supabase** (rutas, horarios, precios, ocupación en tiempo real).
- Integrar **pasarela de pagos** (PSE/Nequi/Daviplata/Tarjeta).
- Crear **panel administrativo** (gestión de rutas, ventas, reportes).
- Notificaciones push y programa de fidelización.
