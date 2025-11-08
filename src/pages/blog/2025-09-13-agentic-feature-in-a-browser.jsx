import { Link } from 'react-router-dom';
import { getBlogPostDates } from '../../utils/blogPostDates';

const { formattedPublishDate } = getBlogPostDates(import.meta.url);

const AgenticFeatureInABrowser = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/blog"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          agentic feature in a browser
        </h1>
        <div className="flex items-center text-gray-600 mb-6">
          <span className="mr-4">Date: {formattedPublishDate}</span>
          <span className="mr-4">By: kumar2net</span>
        </div>

        <div className="text-lg text-gray-700 mb-6 italic">
          <p>
            Tell us about the last thing you got excited about. I like the
            agentic features Perplexity has got in their new Comet web browser.
            I tried out few tasks and it did work well. This along with their
            perplexity.ai/ finance page for India stock market news, earnings,
            other metrics is brilliant.
          </p>
        </div>
      </div>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{
          __html: `
<figure class="wp-block-pullquote"><blockquote><p>Tell us about the last thing you got excited about.</p></blockquote></figure>

<p>I like the agentic features Perplexity has got in their new Comet web browser. I tried out few tasks and it did work well. This along with their perplexity.ai/ finance page for India stock market news, earnings, other metrics is brilliant. </p>

<p></p>

<p></p>
`,
        }}
      />

      {/* Blog interactions */}

      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link to="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to Blog
          </Link>
          <div className="text-sm text-gray-500">
            Originally published on{' '}
            <a
              href="https://kumar2net.wordpress.com/2025/08/23/agentic-feature-in-a-browser/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              WordPress
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgenticFeatureInABrowser;
