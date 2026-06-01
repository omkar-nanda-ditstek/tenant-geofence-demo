"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket-client";

export function RealtimeCounter() {
  const [count, setCount] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    function handleConnect() {
      setConnected(true);
    }

    function handleDisconnect() {
      setConnected(false);
    }

    function handleCounterUpdate(nextCount: number) {
      setCount(nextCount);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("counter:update", handleCounterUpdate);

    if (socket.connected) {
      setConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("counter:update", handleCounterUpdate);
    };
  }, []);

  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Realtime counter</h2>
          <p className="mt-1 text-sm text-slate-600">
            Open this page in two tabs. Clicking increment in one tab updates the other through Socket.io.
          </p>
        </div>
        <span
          className={`h-3 w-3 rounded-full ${connected ? "bg-emerald-500" : "bg-slate-300"}`}
          aria-label={connected ? "Socket connected" : "Socket disconnected"}
          title={connected ? "Socket connected" : "Socket disconnected"}
        />
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="grid h-16 min-w-24 place-items-center rounded border border-slate-200 bg-slate-50 px-6 text-3xl font-bold tabular-nums text-slate-950">
          {count}
        </div>
        <button
          type="button"
          onClick={() => getSocket().emit("counter:increment")}
          className="rounded bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Increment
        </button>
      </div>
    </section>
  );
}
