/// <reference types="vite/client" />

// (Optional) If you want strong typing for your custom vars:
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
