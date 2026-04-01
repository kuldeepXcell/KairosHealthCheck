import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { ServiceStatusCard } from "@/components/ServiceStatusCard";
import { SummaryBar } from "@/components/SummaryBar";
import { getPollIntervalMs, loadServicesFromEnv } from "@/config/services";
import { useHealthMonitor } from "@/hooks/useHealthMonitor";

export function App() {
  const services = useMemo(() => loadServicesFromEnv(), []);
  const pollIntervalMs = useMemo(() => getPollIntervalMs(), []);
  const { states } = useHealthMonitor(services, pollIntervalMs);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    /** Local clock in the header only; health polling uses `VITE_POLL_INTERVAL_MS`. */
    const CLOCK_MS = 1000;
    const id = window.setInterval(() => setNow(new Date()), CLOCK_MS);
    return () => window.clearInterval(id);
  }, []);

  const summary = useMemo(() => {
    let up = 0;
    let down = 0;
    for (const s of states) {
      if (s.status === "up") {
        up += 1;
      } else if (s.status === "down") {
        down += 1;
      }
    }
    return { up, down, total: states.length };
  }, [states]);

  return (
    <div className="app-shell">
      <main className="app-main">
        {services.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <SummaryBar
              total={summary.total}
              up={summary.up}
              down={summary.down}
              pollIntervalMs={pollIntervalMs}
              clock={now}
            />
            <section
              className="service-grid"
              aria-label="Per-service health"
            >
              {states.map((state) => (
                <ServiceStatusCard key={state.serviceId} state={state} />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
