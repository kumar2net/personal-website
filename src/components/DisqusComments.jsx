import { useEffect, useRef, useState, useCallback } from 'react';
import DisqusErrorBoundary from './DisqusErrorBoundary';

const DisqusComments = ({ postId, postUrl, postTitle }) => {
  const disqusRef = useRef(null);
  const scriptRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [_scriptLoaded, setScriptLoaded] = useState(false);

  // Global script management
  useEffect(() => {
    // Check if Disqus script is already loaded globally
    if (window.DISQUS) {
      setScriptLoaded(true);
    }
  }, []);

  const loadDisqus = useCallback(async () => {
    if (isLoading || isLoaded) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Ensure thread element exists
      ensureDisqusThread();

      // Load script if not already loaded
      if (!window.DISQUS) {
        await loadDisqusScript();
      }

      // Wait a bit for DISQUS to be available
      let attempts = 0;
      while (!window.DISQUS && attempts < 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.DISQUS) {
        throw new Error('Disqus failed to initialize');
      }

      // Configure Disqus
      window.disqus_config = function () {
        this.page.url = postUrl || window.location.href;
        this.page.identifier = postId;
        this.page.title = postTitle || document.title;
      };

      // Reset Disqus with error handling
      try {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.url = postUrl || window.location.href;
            this.page.identifier = postId;
            this.page.title = postTitle || document.title;
          },
        });
      } catch (resetError) {
        console.warn('Disqus reset warning:', resetError);
        // Try to reload the thread manually
        const threadElement = document.getElementById('disqus_thread');
        if (threadElement) {
          threadElement.innerHTML = '';
          // Force a new embed
          if (window.DISQUS?.embed) {
            window.DISQUS.embed();
          }
        }
      }

      setIsLoaded(true);
      setIsLoading(false);
    } catch (err) {
      setError(
        'Failed to load Disqus comments. Please refresh the page and try again.'
      );
      setIsLoading(false);
      console.error('Disqus loading error:', err);
    }
  }, [isLoading, isLoaded, postUrl, postId, postTitle]);

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
    };
  }, [isLoaded, isLoading, loadDisqus]);

  const ensureDisqusThread = () => {
    // Ensure the disqus_thread element exists and is clean
    let threadElement = document.getElementById('disqus_thread');
    if (!threadElement) {
      threadElement = document.createElement('div');
      threadElement.id = 'disqus_thread';
      if (disqusRef.current) {
        disqusRef.current.appendChild(threadElement);
      }
    } else {
      // Clear existing content
      threadElement.innerHTML = '';
    }
    return threadElement;
  };

  const loadDisqusScript = () => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.DISQUS) {
        resolve();
        return;
      }

      // Check if script is already in the process of loading
      if (scriptRef.current) {
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = 'https://kumarsite.disqus.com/embed.js';
      script.setAttribute('data-timestamp', Date.now());
      script.async = true;

      script.onerror = () => {
        scriptRef.current = null;
        reject(new Error('Failed to load Disqus script'));
      };

      script.onload = () => {
        setScriptLoaded(true);
        resolve();
      };

      // Store reference
      scriptRef.current = script;

      // Append to head
      if (document.head) {
        document.head.appendChild(script);
      } else {
        document.body.appendChild(script);
      }
    });
  };



  const handleRetry = useCallback(() => {
    setIsLoaded(false);
    setIsLoading(false);
    setError(null);
    loadDisqus();
  }, [loadDisqus]);

  return (
    <DisqusErrorBoundary>
      <div className="mt-12 border-t pt-8 w-full max-w-full overflow-hidden">
        <div className="mb-6 px-4 sm:px-0">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Comments</h3>
          <p className="text-gray-600 text-sm">
            Join the discussion below. Comments are powered by Disqus.
          </p>
        </div>

        <div
          ref={disqusRef}
          className="min-h-[200px] bg-gray-50 rounded-lg p-4 w-full max-w-full overflow-x-auto"
        >
          {error && (
            <div className="flex flex-col items-center justify-center h-32 w-full">
              <div className="text-center px-4">
                <p className="text-red-600 text-sm mb-3 break-words">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Retry Loading Comments
                </button>
              </div>
            </div>
          )}

          {!isLoaded && !error && (
            <div className="flex items-center justify-center h-32 w-full">
              <div className="text-center px-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm break-words">
                  {isLoading
                    ? 'Loading comments...'
                    : 'Scroll to load comments'}
                </p>
              </div>
            </div>
          )}

          {/* Disqus thread will be inserted here */}
          <div id="disqus_thread"></div>
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
