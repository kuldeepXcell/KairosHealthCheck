/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** From `.env` (`ENV=...`); injected in `vite.config.ts` because it is not `VITE_`-prefixed. */
  readonly ENV: string;
  readonly VITE_SERVICES?: string;
  readonly VITE_POLL_INTERVAL_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
