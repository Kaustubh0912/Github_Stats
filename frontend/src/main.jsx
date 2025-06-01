import React, { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorPage from './pages/ErrorPage'
import Home from './pages/Home'
import SimpleWidget from './pages/SimpleWidget'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy load non-critical components
const Widget = React.lazy(() => import('./pages/Widget'))
const Login = React.lazy(() => import('./pages/auth/Login'))
const Callback = React.lazy(() => import('./pages/auth/Callback'))

// Loading fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-github-accent"></div>
  </div>
)

// Error boundary class component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorPage error={this.state.error} />
    }
    return this.props.children
  }
}

// Create router with error boundaries
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'widget',
        element: (
          <ErrorBoundary fallback={<SimpleWidget />}>
            <Suspense fallback={<LoadingFallback />}>
              <Widget />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: 'simple-widget',
        element: <SimpleWidget />,
      },
      {
        path: 'login',
        element: (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Login />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: 'auth/callback',
        element: (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Callback />
            </Suspense>
          </ErrorBoundary>
        ),
      },
    ],
  },
]);

// React is already imported at the top

// Render with error handling
createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>
  </ErrorBoundary>
)
