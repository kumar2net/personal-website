import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

const CodeModal = ({ code, explanation, onClose }) => {
  const codeContainerRef = useRef(null);

  useEffect(() => {
    if (code && codeContainerRef.current) {
      codeContainerRef.current.scrollTop = 0;
    }
  }, [code]);

  if (!code) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Python Code</h2>
            <p className="text-gray-600 mt-2">{explanation}</p>
          </div>
          <div
            ref={codeContainerRef}
            className="p-6 overflow-y-auto bg-gray-800 text-white font-mono text-sm rounded-b-lg"
          >
            <pre>
              <code>{code}</code>
            </pre>
          </div>
          <div className="p-4 border-t text-right bg-gray-50 rounded-b-lg">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CodeModal;
