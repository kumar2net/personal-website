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
      // Ensure our container is still valid
      if (!disqusRef.current || !document.contains(disqusRef.current)) {
        throw new Error('Disqus container is no longer valid');
      }

      // Ensure thread element exists and is properly set up
      const threadElement = ensureDisqusThread();
      
      // Verify the thread element is in the DOM and stable before proceeding
      if (!document.contains(threadElement) || !disqusRef.current?.contains(threadElement)) {
        throw new Error('Disqus thread element not properly attached to DOM');
      }
      
      // Additional check to ensure the element is still valid
      if (threadElement.id !== 'disqus_thread') {
        throw new Error('Disqus thread element was modified during initialization');
      }

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

      // Set up Disqus configuration ONCE to prevent split threads
      // According to Disqus troubleshooting: Use Configuration Variables to Avoid Split Threads
      window.disqus_config = function () {
        this.page.url = postUrl || window.location.href;
        this.page.identifier = postId;
        this.page.title = postTitle || document.title;
        // Prevent split threads by ensuring consistent configuration
        this.page.remote_auth_s3 = null;
        this.page.api_key = null;
      };

      // Final check before Disqus operations
      const finalThreadElement = document.getElementById('disqus_thread');
      if (!finalThreadElement || !disqusRef.current?.contains(finalThreadElement)) {
        throw new Error('Disqus thread element was removed during initialization');
      }

      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use proper Disqus reset to prevent duplication
      // According to Disqus troubleshooting: Why are the same comments showing up on multiple pages?
      if (window.DISQUS.reset) {
        try {
          window.DISQUS.reset({
            reload: true,
            config: window.disqus_config
          });
        } catch (resetError) {
          console.warn('Disqus reset warning:', resetError);
          // Fallback: manually reload the thread
          if (window.DISQUS?.embed && document.getElementById('disqus_thread')) {
            window.DISQUS.embed();
          }
        }
      } else {
        // If reset is not available, use embed directly
        if (window.DISQUS?.embed && document.getElementById('disqus_thread')) {
          window.DISQUS.embed();
        }
      }

      setIsLoaded(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Disqus loading error:', err);
      setError(
        'Something went wrong. Please refresh the page or try again later.'
      );
      setIsLoading(false);
    }
  }, [isLoading, isLoaded, postUrl, postId, postTitle]);

  useEffect(() => {
    // Only load Disqus when component is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded && !isLoading) {
            // Add a small delay to prevent rapid firing
            setTimeout(() => {
              if (!isLoaded && !isLoading) {
                loadDisqus();
              }
            }, 100);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (disqusRef.current) {
      observer.observe(disqusRef.current);
    }

    return () => {
      observer.disconnect();
      // Only cleanup on unmount, not during initialization
      if (!isLoading && !isLoaded) {
        const threads = document.querySelectorAll('#disqus_thread');
        threads.forEach(thread => {
          if (thread.parentNode === disqusRef.current) {
            thread.remove();
          }
        });
      }
    };
  }, [isLoaded, isLoading, loadDisqus]);

  const ensureDisqusThread = () => {
    // Check if we already have a valid thread element in our container
    let threadElement = disqusRef.current?.querySelector('#disqus_thread');
    
    if (!threadElement) {
      // Only remove threads that are not in our container to prevent conflicts
      const existingThreads = document.querySelectorAll('#disqus_thread');
      existingThreads.forEach(thread => {
        if (thread.parentNode && thread.parentNode !== disqusRef.current) {
          thread.remove();
        }
      });

      // Create a fresh thread element
      threadElement = document.createElement('div');
      threadElement.id = 'disqus_thread';
      threadElement.setAttribute('data-disqus-identifier', postId);
      threadElement.setAttribute('data-disqus-url', postUrl || window.location.href);
      
      // Ensure our container exists and is stable before appending
      if (disqusRef.current && document.contains(disqusRef.current)) {
        disqusRef.current.appendChild(threadElement);
        
        // Verify the element was properly added
        if (!document.contains(threadElement)) {
          throw new Error('Failed to append Disqus thread element to DOM');
        }
      } else {
        throw new Error('Disqus container reference is null or not in DOM');
      }
    } else {
      // Clear existing content but keep the element
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
    // Reset all states
    setIsLoaded(false);
    setIsLoading(false);
    setError(null);
    
    // Clear any existing threads
    const threads = document.querySelectorAll('#disqus_thread');
    threads.forEach(thread => thread.remove());
    
    // Small delay before retry to ensure cleanup is complete
    setTimeout(() => {
      if (!isLoaded && !isLoading) {
        loadDisqus();
      }
    }, 200);
  }, [loadDisqus, isLoaded, isLoading]);

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
