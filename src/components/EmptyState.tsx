import styles from "./EmptyState.module.css";

export function EmptyState() {
  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <h2 className={styles.title}>No services configured</h2>
        <p className={styles.text}>
          Set <code className={styles.code}>VITE_SERVICES</code> in a{" "}
          <code className={styles.code}>.env</code> file (see{" "}
          <code className={styles.code}>.env.example</code>) with a JSON array of{" "}
          <code className={styles.code}>name</code> and <code className={styles.code}>baseUrl</code>{" "}
          for each microservice. Restart the dev server after changing environment variables.
        </p>
      </div>
    </div>
  );
}
