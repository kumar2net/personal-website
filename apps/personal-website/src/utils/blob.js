const DEFAULT_BLOB_BASE =
  "https://jf0xcffb3qoqwhu6.public.blob.vercel-storage.com";

const BLOB_PUBLIC_BASE =
  import.meta.env.VITE_BLOB_PUBLIC_BASE || DEFAULT_BLOB_BASE;
const SAVE_ENDPOINT =
  import.meta.env.VITE_BLOB_SAVE_ENDPOINT || "/api/reflections";

const normalizePath = (path) => path.replace(/^\/+/, "");

/**
 * Persist JSON data to the configured Vercel Blob store. Keeps payloads readable
 * for easy manual inspection from the dashboard.
 */
export const saveJSON = async (path, data) => {
  const pathname = normalizePath(path);
  const response = await fetch(SAVE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: pathname, data }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to save reflections";
    try {
      const errorBody = await response.json();
      if (errorBody?.error) {
        errorMessage = errorBody.error;
      }
    } catch {
      const text = await response.text();
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }
};

/**
 * Load JSON data from Blob store. Returns null when the object does not exist.
 */
export const loadJSON = async (path) => {
  try {
    const pathname = normalizePath(path);
    const encodedPath = pathname
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    const response = await fetch(`${BLOB_PUBLIC_BASE}/${encodedPath}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[blob] Failed to load ${path}:`, error.message);
    }
    return null;
  }
};
