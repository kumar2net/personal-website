import * as pdfjsLib from 'pdfjs-dist';
import { useRef, useState } from 'react';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function PDFExtractor({ pdfUrl, onExtract }) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const extractFromUrl = async () => {
    if (!pdfUrl) {
      return;
    }

    setIsExtracting(true);
    setError(null);
    setProgress(0);

    try {
      console.log('📖 Loading PDF from URL...');
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      console.log(`📄 PDF loaded: ${pdf.numPages} pages`);

      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        setProgress((pageNum / pdf.numPages) * 100);
        console.log(`📃 Processing page ${pageNum}/${pdf.numPages}...`);

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        fullText += `${pageText}\n\n`;
      }

      console.log('✅ PDF extraction completed');
      console.log(`📊 Extracted ${fullText.length} characters`);

      if (onExtract) {
        onExtract(fullText);
      }
    } catch (err) {
      console.error('❌ PDF extraction failed:', err);
      setError(err.message);
    } finally {
      setIsExtracting(false);
      setProgress(0);
    }
  };

  const extractFromFile = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    setIsExtracting(true);
    setError(null);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      console.log('📖 Loading PDF from file...');

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      console.log(`📄 PDF loaded: ${pdf.numPages} pages`);

      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        setProgress((pageNum / pdf.numPages) * 100);
        console.log(`📃 Processing page ${pageNum}/${pdf.numPages}...`);

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        fullText += `${pageText}\n\n`;
      }

      console.log('✅ PDF extraction completed');
      console.log(`📊 Extracted ${fullText.length} characters`);

      if (onExtract) {
        onExtract(fullText);
      }
    } catch (err) {
      console.error('❌ PDF extraction failed:', err);
      setError(err.message);
    } finally {
      setIsExtracting(false);
      setProgress(0);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">PDF Content Extractor</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {pdfUrl && (
          <button
            onClick={extractFromUrl}
            disabled={isExtracting}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isExtracting ? 'Extracting...' : 'Extract from URL'}
          </button>
        )}

        <div className="text-center">
          <span className="text-gray-500">or</span>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={extractFromFile}
            disabled={isExtracting}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isExtracting}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {isExtracting ? 'Extracting...' : 'Upload PDF File'}
          </button>
        </div>
      </div>

      {isExtracting && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Extracting content... {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default PDFExtractor;
