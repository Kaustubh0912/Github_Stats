import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function UserProfile() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center p-4 bg-white dark:bg-github-dark rounded-lg shadow-md">
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Not signed in
        </p>
        <Link
          to="/login"
          className="github-btn"
        >
          Sign in with GitHub
        </Link>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 text-center">
          Higher API rate limits<br />
          (5,000 vs 60 requests/hour)
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-github-dark rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={`${user.username}'s avatar`}
            className="w-12 h-12 rounded-full mr-3"
          />
        )}
        <div>
          <h3 className="font-medium">{user.displayName || user.username}</h3>
          <p className="text-sm text-github-accent">@{user.username}</p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          <p>✓ Using authenticated GitHub access</p>
          <p>✓ Higher API rate limits (5,000/hour)</p>
        </div>
        
        <button
          onClick={logout}
          className="w-full text-center py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default UserProfile;