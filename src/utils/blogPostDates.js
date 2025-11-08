const formatDate = (date) =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const getBlogPostDates = (moduleUrl) => {
  const fallbackDate = new Date();
  const fallback = {
    publishDate: fallbackDate,
    lastModifiedDate: fallbackDate,
    formattedPublishDate: formatDate(fallbackDate),
    formattedLastModifiedDate: formatDate(fallbackDate),
    isoPublishDate: fallbackDate.toISOString().split('T')[0],
    isoLastModifiedDate: fallbackDate.toISOString().split('T')[0],
  };

  if (!moduleUrl) {
    return fallback;
  }

  try {
    const url = new URL(moduleUrl, 'http://localhost');
    const fileNameWithQuery = url.pathname.split('/').pop() ?? '';
    const fileName = fileNameWithQuery.split('?')[0];
    const match = fileName.match(/^(\d{4}-\d{2}-\d{2})/);

    if (!match) {
      return fallback;
    }

    const [isoDate] = match;
    const publishDate = new Date(`${isoDate}T00:00:00Z`);

    return {
      publishDate,
      lastModifiedDate: publishDate,
      formattedPublishDate: formatDate(publishDate),
      formattedLastModifiedDate: formatDate(publishDate),
      isoPublishDate: isoDate,
      isoLastModifiedDate: isoDate,
    };
  } catch (error) {
    return fallback;
  }
};
