/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  /**
   * 构建模式
   * - github: 用于 GitHub Pages
   */
  readonly VITE_BUILD_MODE: 'github';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
