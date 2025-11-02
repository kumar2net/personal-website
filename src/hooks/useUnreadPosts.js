import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllPosts, getAllSlugs } from "../data/blogRegistry";
import {
  getUnread as getUnreadIds,
  markRead as storeMarkRead,
  markAllRead as storeMarkAll,
  subscribe as storeSubscribe,
  isUnread as storeIsUnread,
  pruneUnknown,
} from "../utils/unreadStore";

export function useUnreadPosts({ popoverLimit = 8 } = {}) {
  const [posts, setPosts] = useState([]);
  const [tick, setTick] = useState(0); // simple invalidation counter

  // Load registry once
  useEffect(() => {
    const list = getAllPosts();
    setPosts(list);
    // prune any old read keys that are no longer present
    pruneUnknown(getAllSlugs());
  }, []);

  // Subscribe to store changes and storage events
  useEffect(() => {
    const unsub = storeSubscribe(() => setTick((x) => x + 1));
    return unsub;
  }, []);

  const unreadIds = useMemo(() => {
    const slugs = posts.map((p) => p.slug);
    return getUnreadIds(slugs);
  }, [posts, tick]);

  const unreadPosts = useMemo(() => {
    const set = new Set(unreadIds);
    const list = posts.filter((p) => set.has(p.slug));
    return list.slice(0, popoverLimit);
  }, [posts, unreadIds, popoverLimit]);

  const markRead = useCallback((slug, opts) => storeMarkRead(slug, opts), []);
  const markAllRead = useCallback(() => storeMarkAll(unreadIds), [unreadIds]);

  const isUnread = useCallback((slug) => storeIsUnread(slug), [tick]);

  return {
    unreadCount: unreadIds.length,
    unreadPosts,
    markRead,
    markAllRead,
    isUnread,
  };
}

export default useUnreadPosts;

