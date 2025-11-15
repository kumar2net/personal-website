<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Sitemap - kumar2net.com</title>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 2rem auto; max-width: 960px; color: #1f2937; background: #f9fafb; }
          h1 { font-size: 2rem; margin-bottom: 1rem; }
          table { width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius: 0.75rem; overflow: hidden; }
          th, td { padding: 0.9rem 1rem; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 0.95rem; }
          th { background: #eef2ff; color: #1e1e5c; font-weight: 600; }
          tr:hover td { background: #f9fafc; }
          .muted { color: #6b7280; font-size: 0.85rem; margin-top: 0.5rem; }
          a { color: #2563eb; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>kumar2net.com – Sitemap</h1>
        <p class="muted">Loaded directly from sitemap.xml. Ideal for quick inspection; search engines still consume the underlying XML.</p>
        <table>
          <thead>
            <tr>
              <th scope="col">URL</th>
              <th scope="col">Last Modified</th>
              <th scope="col">Change Frequency</th>
              <th scope="col">Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="/s:urlset/s:url">
              <tr>
                <td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td>
                <td><xsl:value-of select="s:lastmod" /></td>
                <td><xsl:value-of select="s:changefreq" /></td>
                <td><xsl:value-of select="s:priority" /></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
        <p class="muted">Last generated: <xsl:value-of select="/s:urlset/s:url[1]/s:lastmod" /></p>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
