export async function fetchOpenLibraryCoverUrl({ title, isbn, author, asin, alternateTitles = [] }) {
  try {
    const tryCoverFromDoc = async (doc) => {
      if (!doc) return null
      if (doc.cover_i) {
        return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
      }
      const firstIsbn = Array.isArray(doc.isbn) && doc.isbn.length > 0 ? doc.isbn[0] : null
      if (firstIsbn) {
        const byIsbnUrl = `https://covers.openlibrary.org/b/isbn/${firstIsbn}-L.jpg?default=false`
        const head = await fetch(byIsbnUrl, { method: 'HEAD' })
        if (head.ok) return byIsbnUrl
      }
      return null
    }

    const search = async (paramsOrQ) => {
      const isString = typeof paramsOrQ === 'string'
      const url = isString
        ? `https://openlibrary.org/search.json?q=${encodeURIComponent(paramsOrQ)}&limit=1`
        : `https://openlibrary.org/search.json?${paramsOrQ}&limit=1`
      const res = await fetch(url)
      if (!res.ok) return null
      const data = await res.json()
      return data?.docs?.[0] || null
    }

    // Prefer ISBN when available
    if (isbn) {
      const isbnUrl = `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-L.jpg?default=false`
      const headResponse = await fetch(isbnUrl, { method: 'HEAD' })
      if (headResponse.ok) return isbnUrl
    }

    // If ASIN is provided, try a generic search; sometimes metadata includes ASINs
    if (asin) {
      const asinDoc = await search(asin)
      const asinCover = await tryCoverFromDoc(asinDoc)
      if (asinCover) return asinCover
    }

    const candidates = [
      title,
      ...alternateTitles,
      author ? `${title || ''} ${author}`.trim() : null,
      author || null,
    ].filter(Boolean)

    // First try param-based searches (title/author) for better accuracy
    if (title || author) {
      let params = ''
      if (title) params += `title=${encodeURIComponent(title)}`
      if (author) params += `${params ? '&' : ''}author=${encodeURIComponent(author)}`
      const doc = await search(params)
      const cover = await tryCoverFromDoc(doc)
      if (cover) return cover
    }

    // Try alternates generically
    for (const q of candidates) {
      const doc = await search(q)
      const cover = await tryCoverFromDoc(doc)
      if (cover) return cover
    }

    return null
  } catch {
    return null
  }
}


