// 参考文档：https://cn.vitejs.dev/guide/env-and-mode.html

// import.meta.env.VITE_APP_TITLE 使用时的ts类型提示
declare global {
  interface ImportMetaEnv {
    readonly VITE_BASE: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
export {};
