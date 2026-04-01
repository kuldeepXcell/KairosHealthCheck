export type ServiceDefinition = {
  id: string;
  name: string;
  baseUrl: string;
};

/** `unknown` until the first `/health` response; then only `up` or `down` (no transient “checking” UI). */
export type HealthStatus = "up" | "down" | "unknown";

export type ServiceHealthState = {
  serviceId: string;
  name: string;
  baseUrl: string;
  status: HealthStatus;
  latencyMs: number | null;
  lastCheckedAt: number | null;
  errorMessage: string | null;
  consecutiveSuccesses: number;
  consecutiveFailures: number;
};

export type HealthCheckResult =
  | { ok: true; latencyMs: number }
  | { ok: false; latencyMs: number | null; errorMessage: string };
