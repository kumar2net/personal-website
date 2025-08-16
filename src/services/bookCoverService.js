import axios from 'axios'

// Book cover service that tries multiple sources
class BookCoverService {
  constructor() {
    this.cache = new Map()
    this.fallbackImages = {
      'the-brain-story': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'cornell-method': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  }

  // Get book cover with automatic fallback
  async getBookCover(bookId, title, author) {
    // Check cache first
    if (this.cache.has(bookId)) {
      return this.cache.get(bookId)
    }

    try {
      // Try Google Books API first
      const googleCover = await this.getGoogleBooksCover(title, author)
      if (googleCover) {
        this.cache.set(bookId, googleCover)
        return googleCover
      }

      // Try OpenLibrary API
      const openLibraryCover = await this.getOpenLibraryCover(title, author)
      if (openLibraryCover) {
        this.cache.set(bookId, openLibraryCover)
        return openLibraryCover
      }

      // Try ISBN lookup
      const isbnCover = await this.getISBNCover(title, author)
      if (isbnCover) {
        this.cache.set(bookId, isbnCover)
        return isbnCover
      }

    } catch (error) {
      console.warn(`Failed to fetch book cover for ${title}:`, error.message)
    }

    // Return fallback image
    const fallback = this.fallbackImages[bookId] || this.fallbackImages['the-brain-story']
    this.cache.set(bookId, fallback)
    return fallback
  }

  // Google Books API
  async getGoogleBooksCover(title, author) {
    try {
      // Use intitle: prefix for more accurate title matching
      const titleQuery = encodeURIComponent(`intitle:${title}`)
      const authorQuery = author ? `+inauthor:${encodeURIComponent(author)}` : ''
      const query = `${titleQuery}${authorQuery}`
      
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=3`,
        { timeout: 5000 }
      )

      if (response.data.items && response.data.items.length > 0) {
        // Try to find the best match
        for (const book of response.data.items) {
          const imageLinks = book.volumeInfo.imageLinks
          
          if (imageLinks) {
            // Try to get the highest quality image available
            const coverUrl = imageLinks.extraLarge || 
                           imageLinks.large || 
                           imageLinks.medium || 
                           imageLinks.small ||
                           imageLinks.thumbnail
            
            if (coverUrl) {
              console.log(`Found cover for "${title}" via Google Books API`)
              return coverUrl
            }
          }
        }
      }
    } catch (error) {
      console.warn('Google Books API failed:', error.message)
    }
    return null
  }

  // OpenLibrary API
  async getOpenLibraryCover(title, author) {
    try {
      const query = encodeURIComponent(`${title} ${author}`)
      const response = await axios.get(
        `https://openlibrary.org/search.json?title=${query}&limit=1`,
        { timeout: 5000 }
      )

      if (response.data.docs && response.data.docs[0]) {
        const book = response.data.docs[0]
        if (book.cover_i) {
          return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        }
      }
    } catch (error) {
      console.warn('OpenLibrary API failed:', error.message)
    }
    return null
  }

  // ISBN Database API (using Google Books as fallback)
  async getISBNCover(title, author) {
    try {
      // First try to get ISBN from Google Books
      const query = encodeURIComponent(`${title} ${author}`)
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`,
        { timeout: 5000 }
      )

      if (response.data.items && response.data.items[0]) {
        const book = response.data.items[0]
        const isbn = book.volumeInfo.industryIdentifiers?.find(id => 
          id.type === 'ISBN_13' || id.type === 'ISBN_10'
        )?.identifier

        if (isbn) {
          // Try OpenLibrary with ISBN
          const isbnResponse = await axios.get(
            `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
            { timeout: 5000 }
          )

          const bookData = isbnResponse.data[`ISBN:${isbn}`]
          if (bookData && bookData.cover) {
            return bookData.cover.large || bookData.cover.medium || bookData.cover.small
          }
        }
      }
    } catch (error) {
      console.warn('ISBN lookup failed:', error.message)
    }
    return null
  }

  // Get cached cover (for immediate use)
  getCachedCover(bookId) {
    return this.cache.get(bookId) || this.fallbackImages[bookId] || this.fallbackImages['the-brain-story']
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }
}

// Create singleton instance
const bookCoverService = new BookCoverService()

export default bookCoverService
