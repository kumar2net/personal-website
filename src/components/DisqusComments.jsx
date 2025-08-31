import { useEffect, useRef, useState } from 'react';
import DisqusErrorBoundary from './DisqusErrorBoundary';

const DisqusComments = ({ postId, postUrl, postTitle }) => {
  const disqusRef = useRef(null);
  const scriptRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only load Disqus when component is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded && !isLoading) {
            loadDisqus();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (disqusRef.current) {
      observer.observe(disqusRef.current);
    }

    return () => {
      observer.disconnect();
      // Clean up script on unmount
      cleanupScript();
    };
  }, [isLoaded, isLoading]);

  const cleanupScript = () => {
    try {
      // Safely remove our script reference
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      scriptRef.current = null;
    } catch (err) {
      console.warn('Script cleanup warning:', err);
    }
  };

  const loadDisqus = () => {
    if (isLoading || isLoaded) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Clear any existing Disqus configuration
      if (window.DISQUS) {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.url = postUrl || window.location.href;
            this.page.identifier = postId;
            this.page.title = postTitle || document.title;
          }
        });
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      // Disqus configuration
      window.disqus_config = function () {
        this.page.url = postUrl || window.location.href;
        this.page.identifier = postId;
        this.page.title = postTitle || document.title;
      };

      // Safely remove any existing Disqus scripts
      const existingScripts = document.querySelectorAll('script[src*="disqus.com/embed.js"]');
      existingScripts.forEach(script => {
        try {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        } catch (err) {
          console.warn('Existing script removal warning:', err);
        }
      });

      // Create new script element
      const script = document.createElement('script');
      script.src = 'https://kumarsite.disqus.com/embed.js';
      script.setAttribute('data-timestamp', +new Date());
      script.async = true;
      
      // Store reference for cleanup
      scriptRef.current = script;
      
      // Add error handling for script loading
      script.onerror = () => {
        setError('Failed to load Disqus comments. Please refresh the page and try again.');
        setIsLoading(false);
        scriptRef.current = null;
      };
      
      script.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
        
        // Ensure Disqus is properly initialized
        setTimeout(() => {
          try {
            if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
              window.DISQUS.reset({
                reload: true,
                config: function () {
                  this.page.url = postUrl || window.location.href;
                  this.page.identifier = postId;
                  this.page.title = postTitle || document.title;
                }
              });
            }
          } catch (err) {
            console.warn('Disqus reset warning:', err);
          }
        }, 100);
      };
      
      // Safely append script to head
      if (document.head) {
        document.head.appendChild(script);
      } else {
        // Fallback to body if head is not available
        document.body.appendChild(script);
      }
    } catch (err) {
      setError('Failed to initialize Disqus comments. Please refresh the page and try again.');
      setIsLoading(false);
      scriptRef.current = null;
      console.error('Disqus loading error:', err);
    }
  };

  const handleRetry = () => {
    setIsLoaded(false);
    setIsLoading(false);
    setError(null);
    cleanupScript();
    loadDisqus();
  };

  return (
    <DisqusErrorBoundary>
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
          {error && (
            <div className="flex flex-col items-center justify-center h-32">
              <div className="text-center">
                <p className="text-red-600 text-sm mb-3">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Retry Loading Comments
                </button>
              </div>
            </div>
          )}
          
          {!isLoaded && !error && (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">
                  {isLoading ? 'Loading comments...' : 'Scroll to load comments'}
                </p>
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
    </DisqusErrorBoundary>
  );
};

export default DisqusComments;
