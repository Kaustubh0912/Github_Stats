import React from 'react';

function RateLimitInfo({ rateLimit, theme = 'dark' }) {
  // If no rate limit info provided, don't render
  if (!rateLimit) return null;
  
  // Calculate percentage of remaining requests
  const remainingPercent = Math.round((rateLimit.remaining / rateLimit.limit) * 100);
  
  // Determine status color
  let statusColor;
  if (remainingPercent > 50) {
    statusColor = 'var(--color-success)';
  } else if (remainingPercent > 10) {
    statusColor = 'var(--color-warning)';
  } else {
    statusColor = 'var(--color-danger)';
  }
  
  // Format reset time
  const resetTime = new Date(rateLimit.reset * 1000).toLocaleTimeString();
  
  return (
    <div className="rate-limit-container">
      <div className="rate-limit-header">
        <span className="rate-limit-title">GitHub API Rate Limit:</span>
        <span className="rate-limit-count">{rateLimit.remaining}/{rateLimit.limit}</span>
      </div>
      
      <div className="rate-limit-progress-bg">
        <div 
          className="rate-limit-progress-bar"
          style={{ 
            width: `${remainingPercent}%`,
            backgroundColor: statusColor
          }}
        ></div>
      </div>
      
      <div className="rate-limit-reset">
        Resets at: {resetTime}
      </div>
    </div>
  );
}

export default RateLimitInfo;