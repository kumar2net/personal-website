import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Shortcuts() {
  const [tab, setTab] = useState('mac');
  const [macSection, setMacSection] = useState('');
  const [chromeSection, setChromeSection] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/docs/shortcuts.md')
      .then((r) =>
        r.ok
          ? r.text()
          : Promise.reject(new Error('Failed to load shortcuts.md'))
      )
      .then((text) => {
        if (!active) return;
        const normalized = text.replace(/\r\n/g, '\n');
        const macMatch = normalized.match(
          /##\s*Mac OS Shortcuts[\s\S]*?(?=\n##\s|$)/i
        );
        const chromeMatch = normalized.match(
          /##\s*Chrome Browser Shortcuts[\s\S]*?(?=\n##\s|$)/i
        );
        setMacSection((macMatch ? macMatch[0] : normalized).trim());
        setChromeSection((chromeMatch ? chromeMatch[0] : '').trim());
      })
      .catch((e) => setError(e.message));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Ready Reckoner: Mac OS & Chrome Shortcuts
      </h1>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium focus:outline-none border-b-2 transition-colors duration-200 ${tab === 'mac' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
          onClick={() => setTab('mac')}
        >
          Mac OS Shortcuts
        </button>
        <button
          className={`ml-2 px-4 py-2 font-medium focus:outline-none border-b-2 transition-colors duration-200 ${tab === 'chrome' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
          onClick={() => setTab('chrome')}
        >
          Chrome Browser Shortcuts
        </button>
      </div>
      <div className="prose">
        {tab === 'mac' ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {macSection}
          </ReactMarkdown>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {chromeSection}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
