import { useEffect, useState } from 'react';
import {
  shouldShowNewBadge,
  shouldShowUpdatedBadge,
} from '../utils/contentDates';

const ContentBadge = ({ publishDate, lastModified, className = '' }) => {
  const [badgeType, setBadgeType] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Determine badge type and visibility using utility functions
    let type = null;
    let visible = false;

    // New content: published within last 7 days
    if (shouldShowNewBadge(publishDate)) {
      type = 'new';
      visible = true;
    }
    // Updated content: modified within last 30 days (but not new)
    else if (shouldShowUpdatedBadge(publishDate, lastModified)) {
      type = 'updated';
      visible = true;
    }

    setBadgeType(type);
    setIsVisible(visible);
  }, [publishDate, lastModified]);

  if (!isVisible || !badgeType) {
    return null;
  }

  const badgeStyles = {
    new: 'bg-red-500 text-white',
    updated: 'bg-blue-500 text-white',
  };

  const badgeText = {
    new: 'NEW',
    updated: 'UPDATED',
  };

  return (
    <div className={`absolute top-2 right-2 z-10 ${className}`}>
      <span
        className={`
        inline-flex items-center px-2 py-1 rounded-full text-xs font-bold
        ${badgeStyles[badgeType]}
        animate-pulse
      `}
      >
        {badgeText[badgeType]}
      </span>
    </div>
  );
};

export default ContentBadge;
