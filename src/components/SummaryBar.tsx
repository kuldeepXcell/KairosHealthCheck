import styles from "./SummaryBar.module.css";

type Props = {
  total: number;
  up: number;
  down: number;
  pollIntervalMs: number;
  clock: Date;
};

export function SummaryBar({ total, up, down, pollIntervalMs, clock }: Props) {
  const timeStr = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(clock);

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <h1 className={styles.heading}>Kairos Living | Dev | Service Health</h1>
        <p className={styles.sub}>
          Polling <code className={styles.code}>/health</code> every{" "}
          <strong>{pollIntervalMs} ms</strong>
        </p>
      </div>
      <div className={styles.stats} role="group" aria-label="Aggregate status">
        <div className={styles.stat}>
          <span className={styles.statLabel}>Services</span>
          <span className={styles.statValue}>{total}</span>
        </div>
        <div className={`${styles.stat} ${styles.statOk}`}>
          <span className={styles.statLabel}>Up</span>
          <span className={styles.statValue}>{up}</span>
        </div>
        <div className={`${styles.stat} ${styles.statBad}`}>
          <span className={styles.statLabel}>Down</span>
          <span className={styles.statValue}>{down}</span>
        </div>
        <div className={styles.clock} aria-hidden="false">
          <span className={styles.clockLabel}>Local</span>
          <time className={styles.clockValue} dateTime={clock.toISOString()}>
            {timeStr}
          </time>
        </div>
      </div>
    </header>
  );
}
