import { Outlet } from 'react-router-dom'
import './App.css'
import { useAuth } from './context/AuthContext'
import AnnouncementBanner from './components/AnnouncementBanner'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      {!isAuthenticated && <AnnouncementBanner />}
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App
