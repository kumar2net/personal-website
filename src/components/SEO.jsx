import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = "Kumar's Personal Website";
const SITE_URL = 'https://kumarsite.netlify.app';
const DEFAULT_IMAGE = `${SITE_URL}/vite.svg`;

export default function SEO({
  title,
  description,
  canonicalPath,
  image,
  type = 'article',
  publishedTime,
  modifiedTime,
  authorName = 'Kumar',
  tags = [],
  sameAs = [
    'https://kumar2net.wordpress.com/',
    'https://twitter.com/kumar2net',
  ],
}) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = canonicalPath ? `${SITE_URL}${canonicalPath}` : SITE_URL;
  const ogImage = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image}`
    : DEFAULT_IMAGE;

  const jsonLdArticle =
    type === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title || SITE_NAME,
          description: description || undefined,
          image: ogImage,
          author: { '@type': 'Person', name: authorName },
          datePublished: publishedTime || undefined,
          dateModified: modifiedTime || publishedTime || undefined,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
          },
          keywords: tags.join(', '),
        }
      : null;

  const jsonLdPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: authorName,
    url,
    sameAs,
  };

  return (
    <Helmet prioritizeSeoTags>
      {pageTitle && <title>{pageTitle}</title>}
      {description && <meta name="description" content={description} />}
      {canonicalPath && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLdArticle && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLdArticle)}
        </script>
      )}
      <script type="application/ld+json">{JSON.stringify(jsonLdPerson)}</script>
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonicalPath: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  publishedTime: PropTypes.string,
  modifiedTime: PropTypes.string,
  authorName: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
};
