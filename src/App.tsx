import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NotesUpload from './pages/NotesUpload'
import Timetable from './pages/Timetable'
import MyNotes from './pages/MyNotes'
import Assignments from './pages/Assignments'
import Profile from './pages/Profile'
import { UserProvider } from './context/UserContext'

function Router() {
    const path = window.location.pathname
    const isAuthenticated = window.localStorage.getItem('smart-campus-authenticated') === 'true'

    const protectedPaths = ['/dashboard', '/notes', '/my-notes', '/timetable', '/assignments', '/profile']

    if (!isAuthenticated && protectedPaths.includes(path)) {
        window.history.replaceState(null, '', '/login')
        return <Login />
    }

    if (isAuthenticated && (path === '/login' || path === '/signup')) {
        window.history.replaceState(null, '', '/dashboard')
        return <Dashboard />
    }

    switch (path) {
        case '/login':
            return <Login />
        case '/signup':
            return <SignUp />
        case '/dashboard':
            return <Dashboard />
        case '/notes':
            return <NotesUpload />
        case '/my-notes':
            return <MyNotes />
        case '/timetable':
            return <Timetable />
        case '/assignments':
            return <Assignments />
        case '/profile':
            return <Profile />
        default:
            return <Home />
    }
}

function App() {
    return (
        <UserProvider>
            <Router />
        </UserProvider>
    )
}

export default App
