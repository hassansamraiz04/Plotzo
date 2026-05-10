const DEFAULT_MAX = 500;

/** Simple LRU keyed map for translations (Phase 3 can swap to Redis). */
export function createLRU(maxEntries = DEFAULT_MAX) {
  const map = new Map();

  function get(key) {
    if (!map.has(key)) return null;
    const val = map.get(key);
    map.delete(key);
    map.set(key, val); // bump recency
    return val;
  }

  function set(key, val) {
    if (map.has(key)) map.delete(key);
    map.set(key, val);
    while (map.size > maxEntries) {
      const oldest = map.keys().next().value;
      map.delete(oldest);
    }
  }

  return { get, set };
}
