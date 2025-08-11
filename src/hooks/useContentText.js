import { useCallback } from 'react';

export function useContentText(maxChars = 5000) {
  const getTextFromRef = useCallback(
    (elementRef) => {
      const element = elementRef?.current;
      if (!element) return '';
      const text = element.innerText || '';
      const normalized = text.replace(/\s+/g, ' ').trim();
      return normalized.slice(0, maxChars);
    },
    [maxChars]
  );

  return { getTextFromRef };
}


