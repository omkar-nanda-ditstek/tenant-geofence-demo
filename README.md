# tenant-geofence-realtime-demo

A small Next.js 14 App Router demo proving three requirements:

- Multi-tenant middleware using a mock Redis `Map`
- A PostGIS geofence check through Prisma `$queryRaw`
- Socket.io realtime counter updates across browser tabs

## Requirements

- Node.js 20+
- Docker and Docker Compose

## Setup

```bash
npm install
cp .env.example .env
docker compose up -d
npx prisma generate
```

Enable PostGIS in the local database:

```bash
docker compose exec db psql -U demo -d demo_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

Start the custom Next.js + Socket.io server:

```bash
npm run dev
```

The app runs at:

```text
http://localhost:3000
```

## Tenant middleware checks

Known tenant:

```bash
curl -H "Host: tenant1.localhost:3000" http://localhost:3000/api/tenant-check
```

Expected response:

```json
{
  "tenantId": "tenant_1",
  "tenantSubdomain": "tenant1",
  "tenantName": "Tenant One"
}
```

Unknown tenant:

```bash
curl -i -H "Host: unknown.localhost:3000" http://localhost:3000/api/tenant-check
```

Expected response:

```json
{
  "message": "Tenant not found"
}
```

Base hosts such as `localhost:3000` and `127.0.0.1:3000` are ignored by the middleware.

## Geofence check

The hardcoded polygon covers this approximate rectangle:

```text
lng 77.0 to 77.4
lat 28.5 to 28.8
```

Inside example:

```bash
curl -X POST http://localhost:3000/api/geofence/check \
  -H "Content-Type: application/json" \
  -d '{"lat":28.6139,"lng":77.2090}'
```

Expected response:

```json
{
  "inside": true,
  "lat": 28.6139,
  "lng": 77.209
}
```

Outside example:

```bash
curl -X POST http://localhost:3000/api/geofence/check \
  -H "Content-Type: application/json" \
  -d '{"lat":29,"lng":77.2090}'
```

Expected response:

```json
{
  "inside": false,
  "lat": 29,
  "lng": 77.209
}
```

## Realtime check

Open `http://localhost:3000` in two browser tabs and click `Increment` in one tab. The counter in the other tab updates through Socket.io.

## Project notes

- No real Redis is used. Tenants live in `src/lib/mock-redis.ts`.
- No tables are required for the geofence check. The polygon is hardcoded and queried directly with PostGIS functions. The schema includes a tiny placeholder model only so Prisma can generate its client.
- The Socket.io server is mounted in `server.ts`, so use `npm run dev` instead of `next dev`.
