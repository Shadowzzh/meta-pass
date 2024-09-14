/**
 * 获取资源路径
 * @description 在 github 环境中使用绝对路径，在其他环境中使用相对路径
 */
export const getAssetPath = (path: string) => {
  // 移除开头的斜杠（如果存在）
  const cleanPath = path.replace(/^\//, '');

  // 在 github 环境中使用绝对路径，在其他环境中使用相对路径
  if (import.meta.env.VITE_BUILD_MODE === 'github') {
    return `./${cleanPath}`;
  } else {
    return `/${cleanPath}`;
  }
};
