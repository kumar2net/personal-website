import { useBookCover } from '../hooks/useBookCover'
import { HiBookOpen } from 'react-icons/hi'

function BookCover({ 
  bookId, 
  title, 
  author, 
  className = "", 
  showLoading = true,
  showError = false,
  onLoad,
  onError 
}) {
  const { coverUrl, isLoading, error } = useBookCover(bookId, title, author)

  const handleImageLoad = () => {
    if (onLoad) onLoad(coverUrl)
  }

  const handleImageError = () => {
    if (onError) onError(error)
  }

  if (isLoading && showLoading) {
    return (
      <div className={`bg-gray-100 border flex items-center justify-center ${className}`}>
        <div className="animate-pulse flex items-center space-x-2">
          <HiBookOpen className="w-8 h-8 text-gray-400" />
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  if (error && showError) {
    return (
      <div className={`bg-gray-100 border flex items-center justify-center ${className}`}>
        <div className="text-center">
          <HiBookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <span className="text-gray-500 text-xs">Cover unavailable</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img 
        src={coverUrl ? coverUrl.replace(/^http:/, 'https:') : coverUrl} 
        alt={`${title} book cover`}
        className="w-full h-full object-cover"
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      {author && (
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded px-2 py-1">
            <p className="text-xs font-semibold text-gray-800 truncate">{author}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookCover
