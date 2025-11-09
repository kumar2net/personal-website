import React from "react";

const Status = () => {
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Deployment Status (Vercel)</h1>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Deployments</h2>
          <div className="flex flex-col gap-2">
            <a
              href="https://kumar2net.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Production: kumar2net.com
            </a>
            <a
              href="https://vercel.com/kumar2net/personal-website/deployments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on Vercel: Deployments
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Preview deployments are created automatically for pull requests.
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Blog notifications</h2>
          <p className="text-sm text-gray-700">
            The blog unread badge script has been fully retired. Navigation now links directly to the blog without showing
            unread counters.
          </p>
          <p className="text-xs text-gray-500 mt-3">
            Visitors can continue exploring the blog archive as usual—no additional scripts or local storage are required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Status;
