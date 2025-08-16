import { useState } from 'react'
import PDFExtractor from '../../components/PDFExtractor'

function PDFExtractorPage() {
  const [extractedText, setExtractedText] = useState('')
  const [markdownContent, setMarkdownContent] = useState('')

  const handleExtract = (text) => {
    setExtractedText(text)
    
    // Convert to markdown
    const markdown = convertToMarkdown(text)
    setMarkdownContent(markdown)
  }

  const convertToMarkdown = (text) => {
    // Clean up the text
    let markdown = text
    
    // Remove excessive whitespace
    markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n')
    markdown = markdown.replace(/\s+/g, ' ')
    
    // Split into paragraphs
    const paragraphs = markdown.split('\n\n').filter(p => p.trim().length > 0)
    
    // Process each paragraph
    const processedParagraphs = paragraphs.map(paragraph => {
      const trimmed = paragraph.trim()
      
      // Detect chapter headings (all caps or short lines)
      if (trimmed.length < 100 && trimmed === trimmed.toUpperCase()) {
        return `## ${trimmed}`
      }
      
      // Detect chapter numbers
      if (/^CHAPTER \d+/i.test(trimmed)) {
        return `# ${trimmed}`
      }
      
      // Detect section headings
      if (/^\d+\.\s+[A-Z]/.test(trimmed)) {
        return `### ${trimmed}`
      }
      
      // Regular paragraph
      return trimmed
    })
    
    // Add frontmatter
    const frontmatter = `---
title: "The Brain: The Story of You"
author: "David Eagleman"
description: "One of the best books I have read in a while. Observing all the advances in AI and listening to gyan from my kin on neurology brain implants, wanted to dig deeper. As they say these days - learn from First Principles"
tags: ["neuroscience", "brain-science", "ai-technology", "neural-implants"]
date: "2025-01-16"
---

# The Brain: The Story of You

*By David Eagleman*

---

`
    
    return frontmatter + processedParagraphs.join('\n\n')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Content copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">PDF Content Extractor</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PDF Extractor */}
          <div>
            <PDFExtractor 
              pdfUrl="https://kumarsite.netlify.app/docs/The_Brain_The_Story.pdf"
              onExtract={handleExtract}
            />
          </div>
          
          {/* Results */}
          <div className="space-y-6">
            {extractedText && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Extracted Text</h3>
                  <button
                    onClick={() => copyToClipboard(extractedText)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {extractedText.substring(0, 2000)}...
                  </pre>
                </div>
              </div>
            )}
            
            {markdownContent && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Markdown Content</h3>
                  <button
                    onClick={() => copyToClipboard(markdownContent)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Copy
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {markdownContent.substring(0, 2000)}...
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFExtractorPage
