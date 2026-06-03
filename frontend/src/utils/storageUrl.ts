const STORAGE_PATH_PREFIX = "/storage/";

const isAbsoluteBrowserUrl = (value: string) =>
  value.startsWith("http://") ||
  value.startsWith("https://") ||
  value.startsWith("blob:") ||
  value.startsWith("data:");

const normalizeAbsoluteStorageUrl = (value: string) => {
  try {
    const url = new URL(value);

    if (url.pathname.startsWith(STORAGE_PATH_PREFIX)) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    // Fall through to the normal path handling below.
  }

  return null;
};

export const getStorageUrl = (value?: string | null): string => {
  const path = value?.trim();

  if (!path) {
    return "";
  }

  const storageUrl = normalizeAbsoluteStorageUrl(path);

  if (storageUrl) {
    return storageUrl;
  }

  if (isAbsoluteBrowserUrl(path)) {
    return path;
  }

  if (path.startsWith(STORAGE_PATH_PREFIX)) {
    return path;
  }

  if (path.startsWith("storage/")) {
    return `/${path}`;
  }

  if (path.startsWith("/")) {
    return path;
  }

  return `${STORAGE_PATH_PREFIX}${path}`;
};
