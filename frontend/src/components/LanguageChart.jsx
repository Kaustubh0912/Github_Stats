import { useEffect, useRef, useState } from 'react';

// Safely import chart.js components
let Doughnut = () => null;  // Fallback component if chart.js fails to load
let Chart, ArcElement, Tooltip, Legend;

try {
  // Try dynamic imports for Chart.js
  const ChartJS = require('chart.js');
  Chart = ChartJS.Chart;
  ArcElement = ChartJS.ArcElement;
  Tooltip = ChartJS.Tooltip;
  Legend = ChartJS.Legend;
  
  // Only register if all components exist
  if (Chart && ArcElement && Tooltip && Legend) {
    Chart.register(ArcElement, Tooltip, Legend);
  }
  
  // Import react-chartjs-2 only if Chart.js loaded successfully
  const ReactChartJS = require('react-chartjs-2');
  Doughnut = ReactChartJS.Doughnut;
} catch (error) {
  console.error('Failed to load Chart.js or react-chartjs-2:', error);
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
  // Add more languages as needed
};

// Fallback colors for languages not in the list
const fallbackColors = [
  '#2ea44f', '#58a6ff', '#f85149', '#8957e5', '#ec6547', 
  '#3fb950', '#d2a8ff', '#a371f7', '#6e7681', '#e3b341'
];

function LanguageChart({ languages, theme }) {
  const chartRef = useRef(null);
  const [chartError, setChartError] = useState(null);

  // Generate consistent colors for languages
  const getLanguageColor = (language, index) => {
    return languageColors[language] || fallbackColors[index % fallbackColors.length];
  };

  // Prepare chart data
  const chartData = {
    labels: languages.map(lang => lang.name),
    datasets: [
      {
        data: languages.map(lang => lang.percentage),
        backgroundColor: languages.map((lang, index) => getLanguageColor(lang.name, index)),
        borderColor: theme === 'dark' ? '#0d1117' : '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: theme === 'dark' ? '#ffffff' : '#213547',
          font: {
            size: 11,
          },
          boxWidth: 12,
          padding: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.formattedValue || '';
            return `${label}: ${value}%`;
          },
        },
      },
    },
    cutout: '70%',
  };

  // Resize observer for responsive chart
  useEffect(() => {
    if (chartRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (chartRef.current?.chartInstance) {
          chartRef.current.chartInstance.resize();
        }
      });
      
      resizeObserver.observe(chartRef.current);
      
      return () => {
        if (chartRef.current) {
          resizeObserver.unobserve(chartRef.current);
        }
      };
    }
  }, []);

  // If Chart.js failed to load or we have a chart error
  if (chartError || !Chart || !Doughnut || typeof Doughnut !== 'function') {
    return (
      <div className="language-chart-container h-64 w-full flex items-center justify-center">
        <div className="text-center text-github-secondary">
          <p>Unable to display language chart</p>
          <ul className="mt-2 text-sm">
            {languages.map((lang, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span 
                  className="inline-block w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getLanguageColor(lang.name, idx) }}
                ></span>
                {lang.name}: {lang.percentage.toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  try {
    // Double-check that Doughnut is available
    if (typeof Doughnut !== 'function') {
      throw new Error('Doughnut chart component is not available');
    }
    
    return (
      <div className="language-chart-container h-64 w-full">
        <Doughnut ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    );
  } catch (error) {
    console.error('Error rendering chart:', error);
    setChartError(error);
    
    // Fallback to simple bar display
    return (
      <div className="language-chart-container h-64 w-full flex items-center justify-center">
        <div className="text-center w-full px-4">
          <p className="text-github-secondary mb-4">Unable to display chart</p>
          {languages.map((lang, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{lang.name}</span>
                <span>{lang.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full" 
                  style={{ 
                    width: `${lang.percentage}%`,
                    backgroundColor: getLanguageColor(lang.name, idx)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default LanguageChart;