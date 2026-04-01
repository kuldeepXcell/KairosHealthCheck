import { useEffect, useMemo, useState } from "react";
import { checkHealth } from "@/api/checkHealth";
import type { ServiceDefinition, ServiceHealthState } from "@/types/health";

function initialState(services: ServiceDefinition[]): Record<string, ServiceHealthState> {
  const map: Record<string, ServiceHealthState> = {};
  for (const s of services) {
    map[s.id] = {
      serviceId: s.id,
      name: s.name,
      baseUrl: s.baseUrl,
      status: "unknown",
      latencyMs: null,
      lastCheckedAt: null,
      errorMessage: null,
      consecutiveSuccesses: 0,
      consecutiveFailures: 0,
    };
  }
  return map;
}

export function useHealthMonitor(services: ServiceDefinition[], intervalMs: number) {
  const [byId, setById] = useState<Record<string, ServiceHealthState>>(() =>
    initialState(services),
  );

  const servicesKey = useMemo(
    () =>
      services
        .map((s) => `${s.id}:${s.baseUrl}`)
        .sort()
        .join("|"),
    [services],
  );

  useEffect(() => {
    setById(initialState(services));
  }, [servicesKey, services]);

  useEffect(() => {
    if (services.length === 0) {
      return;
    }

    const abortControllers = new Map<string, AbortController>();

    const runChecks = () => {
      abortControllers.forEach((c) => c.abort());
      abortControllers.clear();

      for (const svc of services) {
        const ac = new AbortController();
        abortControllers.set(svc.id, ac);
        const signal = ac.signal;

        void (async () => {
          try {
            const result = await checkHealth(svc.baseUrl, signal);
            if (signal.aborted) {
              return;
            }
            const now = Date.now();
            setById((prev) => {
              const cur = prev[svc.id];
              if (!cur) {
                return prev;
              }
              if (result.ok) {
                return {
                  ...prev,
                  [svc.id]: {
                    ...cur,
                    status: "up",
                    latencyMs: result.latencyMs,
                    lastCheckedAt: now,
                    errorMessage: null,
                    consecutiveSuccesses: cur.consecutiveSuccesses + 1,
                    consecutiveFailures: 0,
                  },
                };
              }
              return {
                ...prev,
                [svc.id]: {
                  ...cur,
                  status: "down",
                  latencyMs: result.latencyMs,
                  lastCheckedAt: now,
                  errorMessage: result.errorMessage,
                  consecutiveSuccesses: 0,
                  consecutiveFailures: cur.consecutiveFailures + 1,
                },
              };
            });
          } catch (e) {
            if (e instanceof DOMException && e.name === "AbortError") {
              return;
            }
            const now = Date.now();
            const message = e instanceof Error ? e.message : "Unknown error";
            setById((prev) => {
              const cur = prev[svc.id];
              if (!cur) {
                return prev;
              }
              return {
                ...prev,
                [svc.id]: {
                  ...cur,
                  status: "down",
                  latencyMs: null,
                  lastCheckedAt: now,
                  errorMessage: message,
                  consecutiveSuccesses: 0,
                  consecutiveFailures: cur.consecutiveFailures + 1,
                },
              };
            });
          }
        })();
      }
    };

    runChecks();
    const id = window.setInterval(runChecks, intervalMs);

    return () => {
      window.clearInterval(id);
      abortControllers.forEach((c) => c.abort());
      abortControllers.clear();
    };
  }, [services, servicesKey, intervalMs]);

  const ordered = useMemo(() => {
    return services.map((s) => byId[s.id]).filter(Boolean) as ServiceHealthState[];
  }, [services, byId]);

  return { states: ordered, byId };
}
