/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVICES?: string;
  readonly VITE_POLL_INTERVAL_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
