import { useState } from 'react';
import PropTypes from 'prop-types';
import { trackEvent, trackOutboundLink } from '../utils/analytics';

export default function OriginalPostCallout({ url, source = 'WordPress', compact = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent('copy_original_post_link', { url, source });
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      trackEvent('copy_original_post_link_failed', { url, source, message: e?.message });
    }
  };

  const handleVisit = () => {
    trackOutboundLink(url, { source, placement: 'elsewhere_callout' });
  };

  return (
    <div className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white ${compact ? 'p-3' : 'p-4'} shadow-sm hover:shadow transition-shadow`}> 
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden>
        <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-blue-100"></div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 relative">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full bg-blue-600 text-white">↗</div>
          <div>
            <p className="text-sm text-gray-600">This post lives on {source}.</p>
            <p className="text-base md:text-lg font-medium text-gray-900">Click to read the original post</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleVisit}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            aria-label={`Open original post on ${source}`}
          >
            Read original
            <span aria-hidden>↗</span>
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            aria-live="polite"
            aria-label="Copy original link"
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  );
}

OriginalPostCallout.propTypes = {
  url: PropTypes.string.isRequired,
  source: PropTypes.string,
  compact: PropTypes.bool,
};

