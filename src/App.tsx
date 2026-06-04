import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

function App() {
  const path = window.location.pathname
  const isAuthenticated = window.localStorage.getItem('smart-campus-authenticated') === 'true'

  if (!isAuthenticated && path === '/dashboard') {
    window.history.replaceState(null, '', '/login')
    return <Login />
  }

  if (isAuthenticated && (path === '/login' || path === '/signup')) {
    window.history.replaceState(null, '', '/dashboard')
    return <Dashboard />
  }

  if (path === '/login') {
    return <Login />
  }

  if (path === '/signup') {
    return <SignUp />
  }

  if (path === '/dashboard') {
    return <Dashboard />
  }

  return (
    <Home />
  )
}

export default App
