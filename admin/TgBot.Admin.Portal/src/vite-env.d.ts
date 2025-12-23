/// <reference types="vite/client" />

// Fallback for tooling that doesn't pick up `vite/client` properly.
interface ImportMetaEnv {
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


