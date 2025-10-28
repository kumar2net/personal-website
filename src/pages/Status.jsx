import React from 'react';

const Status = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Deployment Status</h1>
      <a href="https://app.netlify.com/projects/kumarweb/deploys" target="_blank" rel="noopener noreferrer">
        <img src="https://api.netlify.com/api/v1/badges/bfc9b371-d915-45d3-a051-c92d45dd1206/deploy-status" alt="Netlify Status" />
      </a>
      <p className="mt-4">
        This page shows the current deployment status of the website on Netlify.
      </p>
    </div>
  );
};

export default Status;
