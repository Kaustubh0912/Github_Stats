import React from 'react';

function TopReposList({ repos }) {
  if (!repos || repos.length === 0) {
    return (
      <div className="text-center text-github-secondary text-sm py-2">
        No repositories found
      </div>
    );
  }

  return (
    <div className="top-repos-list space-y-3">
      {repos.map(repo => (
        <div key={repo.id} className="repo-item border border-gray-200 dark:border-gray-700 rounded-md p-3">
          <div className="flex justify-between items-start">
            <a 
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-github-accent font-medium hover:underline"
            >
              {repo.name}
            </a>
            <div className="flex items-center space-x-1 text-xs">
              <span>⭐</span>
              <span>{repo.stargazers_count.toLocaleString()}</span>
            </div>
          </div>
          
          {repo.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {repo.description}
            </p>
          )}
          
          <div className="flex items-center mt-2 space-x-4 text-xs text-github-secondary">
            {repo.language && (
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-github-accent mr-1"></span>
                <span>{repo.language}</span>
              </div>
            )}
            
            {repo.forks_count > 0 && (
              <div className="flex items-center">
                <span>🍴 {repo.forks_count}</span>
              </div>
            )}
            
            {repo.open_issues_count > 0 && (
              <div className="flex items-center">
                <span>🔴 {repo.open_issues_count}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TopReposList;