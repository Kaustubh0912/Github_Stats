import React from 'react';

function RecentActivity({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center text-github-secondary text-sm py-2">
        No recent activity found
      </div>
    );
  }

  // Format the event timestamp
  const formatEventTime = (dateString) => {
    try {
      const date = new Date(dateString);
      
      // Calculate time ago manually as a fallback for date-fns
      const now = new Date();
      const diffMs = now - date;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 30) {
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        return `on ${month} ${day}, ${year}`;
      } else if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffMins > 0) {
        return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      } else {
        return 'just now';
      }
    } catch (error) {
      return dateString;
    }
  };

  // Get a human-readable event type
  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'PushEvent':
        return 'Pushed to';
      case 'PullRequestEvent':
        return 'Pull request in';
      case 'IssuesEvent':
        return 'Issue in';
      case 'CreateEvent':
        return 'Created';
      case 'DeleteEvent':
        return 'Deleted';
      case 'WatchEvent':
        return 'Starred';
      case 'ForkEvent':
        return 'Forked';
      case 'IssueCommentEvent':
        return 'Commented on';
      case 'ReleaseEvent':
        return 'Released';
      default:
        return 'Activity in';
    }
  };

  // Get event icon based on type
  const getEventIcon = (type) => {
    switch (type) {
      case 'PushEvent':
        return '📤';
      case 'PullRequestEvent':
        return '🔄';
      case 'IssuesEvent':
        return '❗';
      case 'CreateEvent':
        return '🆕';
      case 'DeleteEvent':
        return '🗑️';
      case 'WatchEvent':
        return '⭐';
      case 'ForkEvent':
        return '🍴';
      case 'IssueCommentEvent':
        return '💬';
      case 'ReleaseEvent':
        return '🏷️';
      default:
        return '📋';
    }
  };

  return (
    <div className="recent-activity space-y-2">
      {activities.map((activity) => (
        <div 
          key={activity.id} 
          className="activity-item p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          <div className="flex items-start">
            <span className="mr-2 text-lg">{getEventIcon(activity.type)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <span className="text-sm font-medium truncate">
                  {getEventTypeLabel(activity.type)}{' '}
                  <a 
                    href={`https://github.com/${activity.repo?.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-github-accent hover:underline"
                  >
                    {activity.repo?.name.split('/')[1]}
                  </a>
                </span>
                <span className="text-xs text-github-secondary">
                  {formatEventTime(activity.created_at)}
                </span>
              </div>
              
              {activity.payload?.commits && activity.payload.commits.length > 0 && (
                <div className="text-xs text-github-secondary mt-1">
                  {activity.payload.commits.length} commit(s)
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentActivity;