import { RealtimeCounter } from "@/components/RealtimeCounter";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-normal text-slate-950">
          Tenant geofence realtime demo
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          A compact Next.js 14 App Router project proving middleware tenant lookup, a raw PostGIS
          geofence query through Prisma, and Socket.io tab-to-tab updates.
        </p>
      </header>

      <RealtimeCounter />

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Quick checks</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <code className="block overflow-x-auto rounded bg-slate-100 p-3">
            curl -H &quot;Host: tenant1.localhost:3000&quot; http://localhost:3000/api/tenant-check
          </code>
          <code className="block overflow-x-auto rounded bg-slate-100 p-3">
            {
              "curl -X POST http://localhost:3000/api/geofence/check -H \"Content-Type: application/json\" -d '{\"lat\":28.6139,\"lng\":77.2090}'"
            }
          </code>
        </div>
      </section>
    </main>
  );
}
