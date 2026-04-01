import type { ServiceHealthState } from "@/types/health";
import styles from "./ServiceStatusCard.module.css";

type Props = {
  state: ServiceHealthState;
};

function formatTime(ts: number | null): string {
  if (ts === null) {
    return "—";
  }
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(ts));
}

export function ServiceStatusCard({ state }: Props) {
  const { status, name, baseUrl, latencyMs, lastCheckedAt, errorMessage } = state;

  const statusLabel = status === "up" ? "Up" : status === "down" ? "Down" : "—";

  const cardClass = [
    styles.card,
    status === "up" ? styles.cardUp : "",
    status === "down" ? styles.cardDown : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClass} aria-labelledby={`svc-title-${state.serviceId}`}>
      <div className={styles.top}>
        <div className={styles.titleRow}>
          <h2 id={`svc-title-${state.serviceId}`} className={styles.title}>
            {name}
          </h2>
          <span
            className={`${styles.badge} ${styles[`badge_${status}`]}`}
            role="status"
            aria-live="polite"
          >
            <span className={styles.badgeDot} aria-hidden />
            {statusLabel}
          </span>
        </div>
        <p className={styles.url} title={baseUrl}>
          {baseUrl}
        </p>
      </div>

      <dl className={styles.meta}>
        <div className={styles.metaRow}>
          <dt>Latency</dt>
          <dd>{latencyMs !== null ? `${latencyMs} ms` : "—"}</dd>
        </div>
        <div className={styles.metaRow}>
          <dt>Last check</dt>
          <dd>{formatTime(lastCheckedAt)}</dd>
        </div>
      </dl>

      {status === "down" && errorMessage ? (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </article>
  );
}
