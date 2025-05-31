import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-github-accent mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error?.statusText || error?.message || "An unexpected error occurred"}
        </p>
        <Link 
          to="/" 
          className="github-btn inline-block"
        >
          Go back to home
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;