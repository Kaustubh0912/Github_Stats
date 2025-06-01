import { useState, useEffect } from 'react';

function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if banner was dismissed in this session
    const dismissed = sessionStorage.getItem('announcement_dismissed');
    if (dismissed) {
      setIsVisible(false);
    }

    // Fetch GitHub API rate limit info
    const checkRateLimit = async () => {
      try {
        const response = await fetch('https://api.github.com/rate_limit');
        if (response.ok) {
          const data = await response.json();
          setRateLimitInfo(data.rate);
        }
      } catch (error) {
        console.error('Failed to fetch rate limit info:', error);
      } finally {
        setLoading(false);
      }
    };

    checkRateLimit();
  }, []);

  const dismissBanner = () => {
    setIsVisible(false);
    sessionStorage.setItem('announcement_dismissed', 'true');
  };

  if (!isVisible || loading) {
    return null;
  }

  return (
    <div className="bg-github-accent/10 border-b border-github-accent/20">
      <div className="container mx-auto py-2 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2 text-github-accent">ℹ️</span>
          <p className="text-sm">
            {rateLimitInfo ? (
              <>
                GitHub API Rate Limit: <strong>{rateLimitInfo.remaining}/{rateLimitInfo.limit}</strong> requests remaining
                {rateLimitInfo.remaining < 10 && (
                  <span className="ml-1 text-github-red font-medium">
                    (Low!) The Simple Widget option is recommended.
                  </span>
                )}
              </>
            ) : (
              <>
                GitHub API has rate limits. The Simple Widget option uses fewer API calls.
              </>
            )}
          </p>
        </div>
        <button
          onClick={dismissBanner}
          className="text-sm text-github-accent hover:text-github-accent/80"
          aria-label="Dismiss announcement"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default AnnouncementBanner;