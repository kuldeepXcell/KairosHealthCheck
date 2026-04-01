import type { HealthCheckResult } from "@/types/health";

function isOkPayload(data: unknown): boolean {
  if (data === null || typeof data !== "object") {
    return false;
  }
  const status = (data as { status?: unknown }).status;
  return typeof status === "string" && status.toLowerCase() === "ok";
}

/**
 * GET {baseUrl}/health — Up only if HTTP 200 and JSON body has status "ok" (case-insensitive).
 */
export async function checkHealth(
  baseUrl: string,
  signal?: AbortSignal,
): Promise<HealthCheckResult> {
  const url = `${baseUrl.replace(/\/$/, "")}/health`;
  const started = performance.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const latencyMs = Math.round(performance.now() - started);

    if (!response.ok) {
      return {
        ok: false,
        latencyMs,
        errorMessage: `HTTP ${response.status} ${response.statusText}`.trim(),
      };
    }

    const text = await response.text();
    let parsed: unknown;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      return { ok: false, latencyMs, errorMessage: "Response is not valid JSON" };
    }

    if (!isOkPayload(parsed)) {
      return {
        ok: false,
        latencyMs,
        errorMessage: 'Expected {"status":"ok"}',
      };
    }

    return { ok: true, latencyMs };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Request failed";
    return { ok: false, latencyMs: null, errorMessage: message };
  }
}
