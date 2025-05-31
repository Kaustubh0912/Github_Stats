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
    <div className="profile-card">
      {/* User Avatar */}
      <div className="profile-avatar-container">
        <img 
          src={userData.avatar_url} 
          alt={`${userData.login}'s avatar`}
          className="profile-avatar"
        />
      </div>
      
      {/* User Info */}
      <div className="profile-info">
        <h2 className="profile-name">
          {userData.name || userData.login}
          {userData.name && (
            <span className="profile-username">
              @{userData.login}
            </span>
          )}
        </h2>
        
        {userData.bio && (
          <p className="profile-bio">
            {userData.bio}
          </p>
        )}
        
        {userData.location && (
          <p className="profile-detail">
            <span className="profile-icon">📍</span> {userData.location}
          </p>
        )}
        
        {userData.created_at && (
          <p className="profile-detail">
            <span className="profile-icon">🗓️</span> Joined GitHub on {formatJoinDate(userData.created_at)}
          </p>
        )}
        
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{userData.public_repos}</div>
            <div className="stat-label">Repos</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{userData.followers}</div>
            <div className="stat-label">Followers</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{userData.following}</div>
            <div className="stat-label">Following</div>
          </div>
        </div>
        
        {/* GitHub Profile Link */}
        <a 
          href={userData.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="profile-link"
        >
          View Profile
        </a>
      </div>
    </div>
  );
}

export default StatsCard;