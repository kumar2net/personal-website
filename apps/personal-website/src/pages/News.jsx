const NEWS_URL = "https://impnews.netlify.app/";

export default function News() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-3">News</h1>
      <p className="text-gray-600 mb-6">
        Live updates are provided by{" "}
        <a
          href={NEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          IMP News
        </a>
        .
      </p>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <iframe
          src={NEWS_URL}
          title="IMP News Feed"
          className="w-full"
          style={{ minHeight: "75vh" }}
          loading="lazy"
        />
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Trouble loading the feed?{" "}
        <a
          href={NEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Open IMP News in a new tab
        </a>
        .
      </p>
    </div>
  );
}
