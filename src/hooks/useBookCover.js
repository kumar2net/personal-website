import { useState, useEffect } from 'react'
import bookCoverService from '../services/bookCoverService'

export function useBookCover(bookId, title, author) {
  const [coverUrl, setCoverUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchCover = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // First show cached cover if available
        const cachedCover = bookCoverService.getCachedCover(bookId)
        if (cachedCover && isMounted) {
          setCoverUrl(cachedCover)
          setIsLoading(false)
        }

        // Then try to fetch fresh cover
        const freshCover = await bookCoverService.getBookCover(bookId, title, author)
        
        if (isMounted) {
          setCoverUrl(freshCover)
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
          setIsLoading(false)
          // Set fallback cover
          const fallbackCover = bookCoverService.getCachedCover(bookId)
          setCoverUrl(fallbackCover)
        }
      }
    }

    if (bookId && title) {
      fetchCover()
    } else {
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [bookId, title, author])

  return {
    coverUrl,
    isLoading,
    error,
    refetch: () => {
      bookCoverService.clearCache()
      setCoverUrl(null)
      setIsLoading(true)
      setError(null)
    }
  }
}
