/* ============================================================
 * LocalStorageService.js – Simple abstraction over the native
 * localStorage API.
 *
 * Provides three helper functions: storeInLocalStorage (set),
 * get (retrieve), and remove (delete). Used throughout the app
 * to persist auth tokens and other small pieces of data.
 * ============================================================ */

/** Save a key-value pair to localStorage. */
const storeInLocalStorage = (name, value) => {
  localStorage.setItem(name, value);
};

/** Retrieve a value from localStorage by key. Returns null if missing. */
const get = (name) => {
  let value = localStorage.getItem(name);
  return value;
};

/** Remove a key-value pair from localStorage. */
const remove = (name) => {
  localStorage.removeItem(name);
};

export { storeInLocalStorage, get, remove };
