import React from 'react';

function RateLimitInfo({ rateLimit, theme = 'dark' }) {
  // If no rate limit info provided, don't render
  if (!rateLimit) return null;
  
  // Calculate percentage of remaining requests
  const remainingPercent = Math.round((rateLimit.remaining / rateLimit.limit) * 100);
  
  // Determine status color
  let statusColor;
  if (remainingPercent > 50) {
    statusColor = 'bg-github-green';
  } else if (remainingPercent > 10) {
    statusColor = 'bg-github-yellow';
  } else {
    statusColor = 'bg-github-red';
  }
  
  // Format reset time
  const resetTime = new Date(rateLimit.reset * 1000).toLocaleTimeString();
  
  return (
    <div className={`rate-limit-info text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-3 p-2 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="flex items-center mb-1 justify-between">
        <span>GitHub API Rate Limit:</span>
        <span className="font-mono">{rateLimit.remaining}/{rateLimit.limit}</span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
        <div 
          className={`${statusColor} h-1.5 rounded-full`} 
          style={{ width: `${remainingPercent}%` }}
        ></div>
      </div>
      
      <div className="text-xs">
        Resets at: {resetTime}
      </div>
    </div>
  );
}

export default RateLimitInfo;