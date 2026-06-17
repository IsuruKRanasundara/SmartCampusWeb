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

// Pages that render WITHOUT the shell (no nav bars)
const NO_SHELL_PATHS = ['/', '/login', '/signup']

// Pages that are protected (require auth)
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
 * AppShell — wraps every authenticated page with:
 *   • Navbar      (sticky top, desktop only — hidden on mobile via lg: classes inside Navbar)
 *   • <main>      (scrollable content, padded so it never hides under either nav bar)
 *   • BottomNavigation (fixed bottom, mobile only — hidden on desktop via lg: classes inside BottomNavigation)
 */
function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            {/* ① Sticky top navbar — renders nothing on mobile (<lg) internally */}
            <Navbar />

            {/*
             * ② Scrollable main content area
             *
             * pb-[5.5rem]  — on mobile, pushes content above the fixed bottom nav
             *                (the nav is ~4.5 rem tall; 5.5 gives a comfortable gap)
             * lg:pb-6      — on desktop there's no bottom nav, so normal padding
             */}
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-[5.5rem] sm:px-6 lg:pb-6 xl:px-8">
                {children}
            </main>

            {/* ③ Fixed bottom nav — renders nothing on desktop (lg:hidden) internally */}
            <BottomNavigation />
        </div>
    )
}

/** Resolves the current page component from window.location.pathname */
function PageContent({ path }: { path: string }) {
    switch (path) {
        case '/dashboard':
            return (
                <>
                    <Dashboard />
                    {/* QuickNav is part of the Dashboard page but placed here
                        so it always appears beneath the dashboard content.
                        If Dashboard already renders QuickNav internally, remove this. */}
                </>
            )
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
        case '/announcements':
            return <Announcements />
        case '/events':
            return <Events />
        case '/facilities':
            return <Facilities />
        case '/assistant':
            return <Assistant />
        case '/courses':
            return <Courses />
        default:
            return <Home />
    }
}

function Router() {
    // Track path in state so back/forward navigation re-renders the app
    const [path, setPath] = useState(window.location.pathname)

    useEffect(() => {
        const onPopState = () => setPath(window.location.pathname)
        window.addEventListener('popstate', onPopState)
        return () => window.removeEventListener('popstate', onPopState)
    }, [])

    const isAuthenticated = window.localStorage.getItem('smart-campus-authenticated') === 'true'

    // Redirect unauthenticated users away from protected pages
    if (!isAuthenticated && PROTECTED_PATHS.includes(path)) {
        window.history.replaceState(null, '', '/login')
        return <Login />
    }

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && (path === '/login' || path === '/signup')) {
        window.history.replaceState(null, '', '/dashboard')
        return (
            <AppShell>
                <PageContent path="/dashboard" />
            </AppShell>
        )
    }

    // Public / auth pages — rendered WITHOUT the shell
    if (NO_SHELL_PATHS.includes(path)) {
        switch (path) {
            case '/login':
                return <Login />
            case '/signup':
                return <SignUp />
            default:
                return <Home />
        }
    }

    // All other (protected) pages — wrapped in the shell
    return (
        <AppShell>
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