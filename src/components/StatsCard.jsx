function StatsCard({ userData }) {
  // Format GitHub join date
  const formatJoinDate = (dateString) => {
    try {
      const date = new Date(dateString);
      // Simple date formatting if date-fns is not available
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="user-profile flex flex-col sm:flex-row items-center sm:items-start gap-4">
      {/* User Avatar */}
      <div className="avatar-container">
        <img 
          src={userData.avatar_url} 
          alt={`${userData.login}'s avatar`}
          className="w-20 h-20 rounded-full border-2 border-github-accent"
        />
      </div>
      
      {/* User Info */}
      <div className="user-info flex-1">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {userData.name || userData.login}
          {userData.name && (
            <span className="text-sm font-normal text-github-secondary">
              @{userData.login}
            </span>
          )}
        </h2>
        
        {userData.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-300 my-1">
            {userData.bio}
          </p>
        )}
        
        {userData.location && (
          <p className="text-xs text-github-secondary my-1">
            📍 {userData.location}
          </p>
        )}
        
        {userData.created_at && (
          <p className="text-xs text-github-secondary my-1">
            🗓️ Joined GitHub on {formatJoinDate(userData.created_at)}
          </p>
        )}
        
        {/* Stats Grid */}
        <div className="stats-grid grid grid-cols-3 gap-2 mt-3">
          <div className="stat-item">
            <div className="stat-value font-semibold">{userData.public_repos}</div>
            <div className="stat-label text-xs text-github-secondary">Repos</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value font-semibold">{userData.followers}</div>
            <div className="stat-label text-xs text-github-secondary">Followers</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value font-semibold">{userData.following}</div>
            <div className="stat-label text-xs text-github-secondary">Following</div>
          </div>
        </div>
        
        {/* GitHub Profile Link */}
        <a 
          href={userData.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-sm github-btn"
        >
          View Profile
        </a>
      </div>
    </div>
  );
}

export default StatsCard;