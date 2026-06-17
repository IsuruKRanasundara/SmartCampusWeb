import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NotesUpload from './pages/NotesUpload'
import Timetable from './pages/Timetable'
import MyNotes from './pages/MyNotes'
import Assignments from './pages/Assignments'
import Profile from './pages/Profile'
import Announcements from './pages/Announcement'
import Events from './pages/Events'
import Facilities from './pages/Facilities'
import Assistant from './pages/Assistant'
import Courses from './pages/Courses'
import { UserProvider } from './context/UserContext'
import Navbar from './components/layout/Navbar'
import BottomNavigation from './components/layout/BottomNavigation'

const NO_SHELL_PATHS = ['/', '/login', '/signup']

// Pages that manage their own full-screen layout (own header etc.)
const SELF_MANAGED_PATHS = [
    '/assistant',
    '/courses',
    '/announcements',
    '/events',
    '/facilities',
    '/timetable',
    '/my-notes',
    '/notes',
    '/assignments',
    '/profile',
]

const PROTECTED_PATHS = [
    '/dashboard',
    '/notes',
    '/my-notes',
    '/timetable',
    '/assignments',
    '/profile',
    '/announcements',
    '/events',
    '/facilities',
    '/assistant',
    '/courses',
]

/**
 * AppShell — wraps authenticated pages with top Navbar + bottom nav padding.
 * Self-managed pages (those with their own sticky header) skip the top Navbar
 * but still get the bottom padding so content isn't hidden under the mobile nav.
 */
function AppShell({ children, path }: { children: React.ReactNode; path: string }) {
    const isSelfManaged = SELF_MANAGED_PATHS.includes(path)

    if (isSelfManaged) {
        // These pages have their own header — just add bottom padding for mobile nav
        return (
            <div className="flex min-h-screen flex-col">
                {children}
                <BottomNavigation />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Navbar />
            {/*
              * pb-20 on mobile gives clearance above the fixed bottom nav (~72px + safe area).
              * lg:pb-8 resets this on desktop where there's no bottom nav.
              */}
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 sm:px-6 lg:pb-8 xl:px-8">
                {children}
            </main>
            <BottomNavigation />
        </div>
    )
}

function PageContent({ path }: { path: string }) {
    switch (path) {
        case '/dashboard': return <Dashboard />
        case '/notes': return <NotesUpload />
        case '/my-notes': return <MyNotes />
        case '/timetable': return <Timetable />
        case '/assignments': return <Assignments />
        case '/profile': return <Profile />
        case '/announcements': return <Announcements />
        case '/events': return <Events />
        case '/facilities': return <Facilities />
        case '/assistant': return <Assistant />
        case '/courses': return <Courses />
        default: return <Home />
    }
}

function Router() {
    const [path, setPath] = useState(window.location.pathname)

    useEffect(() => {
        const onPopState = () => setPath(window.location.pathname)
        window.addEventListener('popstate', onPopState)
        return () => window.removeEventListener('popstate', onPopState)
    }, [])

    const isAuthenticated = window.localStorage.getItem('smart-campus-authenticated') === 'true'

    if (!isAuthenticated && PROTECTED_PATHS.includes(path)) {
        window.history.replaceState(null, '', '/login')
        return <Login />
    }

    if (isAuthenticated && (path === '/login' || path === '/signup')) {
        window.history.replaceState(null, '', '/dashboard')
        return (
            <AppShell path="/dashboard">
                <PageContent path="/dashboard" />
            </AppShell>
        )
    }

    if (NO_SHELL_PATHS.includes(path)) {
        switch (path) {
            case '/login': return <Login />
            case '/signup': return <SignUp />
            default: return <Home />
        }
    }

    return (
        <AppShell path={path}>
            <PageContent path={path} />
        </AppShell>
    )
}

function App() {
    return (
        <UserProvider>
            <Router />
        </UserProvider>
    )
}

export default App