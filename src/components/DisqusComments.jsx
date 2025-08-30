import { useEffect, useRef, useState } from 'react';

const DisqusComments = ({ postId, postUrl, postTitle }) => {
  const disqusRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only load Disqus when component is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            loadDisqus();
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (disqusRef.current) {
      observer.observe(disqusRef.current);
    }

    return () => observer.disconnect();
  }, [isLoaded]);

  const loadDisqus = () => {
    // Disqus configuration
    window.disqus_config = function () {
      this.page.url = postUrl || window.location.href;
      this.page.identifier = postId;
      this.page.title = postTitle || document.title;
    };

    // Load Disqus script
    const script = document.createElement('script');
    script.src = 'https://kumarsite.disqus.com/embed.js';
    script.setAttribute('data-timestamp', +new Date());
    script.async = true;
    document.head.appendChild(script);
  };

  return (
    <div className="mt-12 border-t pt-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Comments</h3>
        <p className="text-gray-600 text-sm">
          Join the discussion below. Comments are powered by Disqus.
        </p>
      </div>
      
      <div 
        ref={disqusRef}
        id="disqus_thread"
        className="min-h-[200px] bg-gray-50 rounded-lg p-4"
      >
        {!isLoaded && (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading comments...</p>
            </div>
          </div>
        )}
      </div>
      
      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript">
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
  );
};

export default DisqusComments;
