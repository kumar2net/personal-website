import { motion } from "framer-motion";
import pythonCodeRaw from "../../../../../docs/DLalgoblogreco.py?raw";

const pythonCode = pythonCodeRaw.trim();

const sectionHeadings = Array.from(
  new Set(
    pythonCode
      .split("\n")
      .filter(
        (line) =>
          line.trim().startsWith("# ") && !line.trim().startsWith("# -*-"),
      )
      .map((line) => line.replace(/^#\s*/, "").trim())
      .filter(Boolean),
  ),
);

const AiRecommenderCode = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-4">
        AI-Powered Blog Content Recommender - Full Script
      </h1>
      <p className="text-gray-600 mb-6">
        This Colab notebook connects to Google BigQuery for GA4 data, explores
        available datasets, and then applies TF-IDF, K-Means clustering, topic
        popularity analysis, and lightweight heuristics to suggest new blog
        topics.
      </p>
      {sectionHeadings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Key Steps Inside the Notebook
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {sectionHeadings.map((heading) => (
              <div
                key={heading}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
              >
                {heading}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-gray-100 shadow-inner">
        <pre className="text-sm leading-relaxed">
          <code>{pythonCode}</code>
        </pre>
      </div>
    </motion.div>
  );
};

export default AiRecommenderCode;
