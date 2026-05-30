const STORAGE_PREFIX = "http://localhost:8000/storage/";

const isAbsoluteBrowserUrl = (value: string) =>
  value.startsWith("http://") ||
  value.startsWith("https://") ||
  value.startsWith("blob:") ||
  value.startsWith("data:");

export const getStorageUrl = (value?: string | null): string => {
  const path = value?.trim();



  if (!path) {
    return "";
  }

  if (isAbsoluteBrowserUrl(path)) {
    return path;
  }

  if (path.startsWith("/storage/")) {
    return path;
  }

  if (path.startsWith("storage/")) {
    return `/${path}`;
  }

  if (path.startsWith("/")) {
    return path;
  }

  return `${STORAGE_PREFIX}${path}`;
};
