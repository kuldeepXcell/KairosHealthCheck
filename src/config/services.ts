import type { ServiceDefinition } from "@/types/health";

function slugify(value: string, index: number): string {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `service-${index}`;
}

/**
 * Parses VITE_SERVICES JSON: [{ "name": "...", "baseUrl": "https://..." }, ...]
 * Also accepts legacy "url" instead of "baseUrl".
 */
export function parseServiceDefinitions(raw: string | undefined): ServiceDefinition[] {
  if (!raw?.trim()) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const out: ServiceDefinition[] = [];
    parsed.forEach((item, index) => {
      if (!item || typeof item !== "object") {
        return;
      }
      const record = item as Record<string, unknown>;
      const name = String(record.name ?? "").trim();
      const baseUrl = String(record.baseUrl ?? record.url ?? "").trim();
      if (!name || !baseUrl) {
        return;
      }
      try {
        // Validate URL shape early
        new URL(baseUrl);
      } catch {
        return;
      }
      out.push({
        id: `${slugify(name, index)}-${index}`,
        name,
        baseUrl: baseUrl.replace(/\/$/, ""),
      });
    });
    return out;
  } catch {
    return [];
  }
}

/** Used only when `VITE_POLL_INTERVAL_MS` is missing or invalid (not 1s). */
const DEFAULT_POLL_INTERVAL_MS = 5000;

/**
 * Health poll interval from `VITE_POLL_INTERVAL_MS` (milliseconds).
 * Minimum 250 ms. If unset or invalid, uses {@link DEFAULT_POLL_INTERVAL_MS}.
 */
export function getPollIntervalMs(): number {
  const raw = import.meta.env.VITE_POLL_INTERVAL_MS;
  if (!raw?.trim()) {
    return DEFAULT_POLL_INTERVAL_MS;
  }
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 250) {
    return DEFAULT_POLL_INTERVAL_MS;
  }
  return n;
}

export function loadServicesFromEnv(): ServiceDefinition[] {
  return parseServiceDefinitions(import.meta.env.VITE_SERVICES);
}
