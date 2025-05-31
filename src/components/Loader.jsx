import React from 'react';

function Loader() {
  return (
    <div className="flex justify-center items-center h-full min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-github-accent"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Loader;