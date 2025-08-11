import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const location = useLocation();
  const { pathname, search, hash } = location;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (hash) return; // preserve in-page anchor behavior
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search, hash]);

  return null;
}


