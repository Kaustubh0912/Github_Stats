# GitHub Stats Widget

A web-based embeddable widget that displays public GitHub statistics for any user using the GitHub API. The widget can be embedded in websites using an `<iframe>` and is built with the MERN stack.

![GitHub Stats Widget Preview](public/widget-preview.png)

## Features

- **Profile Info**: Avatar, name, bio, location, profile link
- **Account Stats**: Public repos, followers, following, GitHub join date
- **Language Stats**: Most used languages computed from repos
- **Repo Stats**: Top repositories by stars
- **Recent Activity**: Latest GitHub activities
- **Embeddable UI**: Responsive card for iframe with customizable themes

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS, Chart.js
- **Backend**: Express.js + Node.js
- **Database**: MongoDB (optional for caching & analytics)

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB (optional)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/github-stats-widget.git
   cd github-stats-widget
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Install backend dependencies:
   ```
   cd server
   npm install
   ```

4. Configure environment variables:
   - Create `.env` file in the root for frontend settings
   - Create `.env` file in the server directory for backend settings

5. Start the development servers:
   - Frontend: `npm run dev` (from the root directory)
   - Backend: `npm run dev` (from the server directory)

## Usage

### Embedding the Widget

Add the following HTML code to embed the widget on your website:

```html
<iframe
  src="https://yourdomain.com/widget?user=octocat"
  width="400"
  height="300"
  style="border:none; overflow:hidden;"
  loading="lazy">
</iframe>
```

### URL Parameters

Customize the widget appearance and behavior with these URL parameters:

- `?user=username` - GitHub username to display (required)
- `&theme=dark` or `&theme=light` - Set the color theme
- `&langLimit=5` - Limit the number of languages displayed
- `&repoLimit=3` - Limit the number of repositories displayed

## API Endpoints

The backend provides these endpoints:

- `GET /api/github/:username` - Get user profile data
- `GET /api/github/:username/repos` - Get user repositories
- `GET /api/github/:username/activity` - Get recent activity
- `GET /api/github/:username/languages` - Get language statistics

## Deployment

### Frontend

The frontend can be deployed to Vercel, Netlify, or any static site hosting:

```
npm run build
```

### Backend

The backend can be deployed to Render, Railway, or any Node.js hosting:

```
cd server
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GitHub API for providing the data
- React and Express communities for the awesome frameworks
