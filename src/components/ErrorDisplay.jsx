import React from 'react';

function ErrorDisplay({ message }) {
  return (
    <div className="flex flex-col justify-center items-center h-full min-h-[200px] p-4 text-center">
      <div className="text-github-red text-4xl mb-2">⚠️</div>
      <h3 className="text-lg font-medium mb-1">Something went wrong</h3>
      <p className="text-github-secondary text-sm">{message || 'Failed to load GitHub data'}</p>
    </div>
  );
}

export default ErrorDisplay;