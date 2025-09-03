import { useEffect, useRef } from 'react';

export default function TwitterTimeline({ username = 'kumar2net', height = 600 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ensureScript = () => {
      return new Promise((resolve) => {
        if (window.twttr && window.twttr.widgets) return resolve(window.twttr);
        const existing = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
        if (existing) {
          existing.addEventListener('load', () => resolve(window.twttr));
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.onload = () => resolve(window.twttr);
        document.body.appendChild(script);
      });
    };

    ensureScript().then((twttr) => {
      if (!twttr || !containerRef.current) return;
      containerRef.current.innerHTML = '';
      twttr.widgets.createTimeline(
        {
          sourceType: 'profile',
          screenName: username,
        },
        containerRef.current,
        {
          height,
          chrome: 'noheader nofooter noborders',
          dnt: true,
        }
      );
    });
  }, [username, height]);

  return <div ref={containerRef} className="w-full" />;
}
