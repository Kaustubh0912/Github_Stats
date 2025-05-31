import React from 'react';

function SimpleLanguageChart({ languages, theme = 'dark' }) {
  if (!languages || languages.length === 0) {
    return (
      <div className="language-empty-state">
        No language data available
      </div>
    );
  }

  // GitHub language colors (common ones)
  const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Ruby: '#CC342D',
    PHP: '#4F5D95',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Shell: '#89e051',
    PowerShell: '#012456',
    Dockerfile: '#384d54',
    Vue: '#41b883',
    React: '#61dafb',
    'ASP.NET': '#512bd4',
    ShaderLab: '#222c37',
  };

  // Fallback colors for languages not in the list
  const fallbackColors = [
    '#2ea44f', '#58a6ff', '#f85149', '#8957e5', '#ec6547', 
    '#3fb950', '#d2a8ff', '#a371f7', '#6e7681', '#e3b341'
  ];

  // Get color for a language
  const getLanguageColor = (language, index) => {
    return languageColors[language] || fallbackColors[index % fallbackColors.length];
  };

  return (
    <div className="language-chart-container">
      {/* Bar Chart */}
      <div className="language-bars">
        {languages.map((lang, idx) => (
          <div key={idx} className="language-bar-item">
            <div className="language-bar-header">
              <span className="language-name">{lang.name}</span>
              <span className="language-percentage">{lang.percentage.toFixed(1)}%</span>
            </div>
            <div className="language-bar">
              <div 
                className="language-segment" 
                style={{ 
                  width: `${lang.percentage}%`,
                  backgroundColor: getLanguageColor(lang.name, idx)
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Color Legend */}
      <div className="language-legend">
        {languages.map((lang, idx) => (
          <div key={idx} className="language-legend-item">
            <span 
              className="language-color-dot" 
              style={{ backgroundColor: getLanguageColor(lang.name, idx) }}
            ></span>
            <span className="language-legend-name">
              {lang.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimpleLanguageChart;