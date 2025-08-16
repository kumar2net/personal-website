// Test utility for Google Books API
export async function testGoogleBooksAPI() {
  const testBooks = [
    {
      title: "The Brain: The Story of You",
      author: "David Eagleman",
      expectedQuery: "intitle:The+Brain:+The+Story+of+You+inauthor:David+Eagleman"
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      expectedQuery: "intitle:The+Hobbit+inauthor:J.R.R.+Tolkien"
    }
  ]

  console.log("🧪 Testing Google Books API...")

  for (const book of testBooks) {
    try {
      const titleQuery = encodeURIComponent(`intitle:${book.title}`)
      const authorQuery = `+inauthor:${encodeURIComponent(book.author)}`
      const query = `${titleQuery}${authorQuery}`
      
      const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
      
      console.log(`\n📚 Testing: "${book.title}" by ${book.author}`)
      console.log(`🔗 URL: ${url}`)
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.items && data.items.length > 0) {
        const bookData = data.items[0]
        const imageLinks = bookData.volumeInfo.imageLinks
        
        console.log(`✅ Found book: "${bookData.volumeInfo.title}"`)
        console.log(`📖 Author: ${bookData.volumeInfo.authors?.join(', ') || 'Unknown'}`)
        
        if (imageLinks) {
          console.log(`🖼️  Cover available: ${imageLinks.thumbnail || imageLinks.smallThumbnail}`)
        } else {
          console.log(`❌ No cover image available`)
        }
      } else {
        console.log(`❌ No books found`)
      }
      
    } catch (error) {
      console.error(`❌ Error testing "${book.title}":`, error.message)
    }
  }
  
  console.log("\n✅ Google Books API test completed!")
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testGoogleBooksAPI = testGoogleBooksAPI
}
