/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL_PROD: string;
  readonly VITE_API_URL_TES: string;
  readonly VITE_BASE_PROD: string;
  // adicione outras variáveis VITE_... que você usar
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}