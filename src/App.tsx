import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
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
import PwaInstallBanner from './components/PwaInstallBanner'

// Pages that manage their own sticky header — skip the shared Navbar
const SELF_MANAGED = new Set([
    '/assistant', '/courses', '/announcements', '/events',
    '/facilities', '/timetable', '/my-notes', '/notes',
    '/assignments', '/profile',
])

function isAuthed() {
    return (
        localStorage.getItem('smart-campus-authenticated') === 'true' &&
        !!(localStorage.getItem('smart-campus-token') || localStorage.getItem('token'))
    )
}

/** Redirects to /login if not authenticated */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()
    const authed = isAuthed()

    useEffect(() => {
        if (!authed) navigate('/login', { replace: true })
    }, [authed, navigate])

    return authed ? <>{children}</> : null
}

/** Wraps authenticated pages with Navbar + bottom nav + PWA banner */
function AppShell({ children }: { children: React.ReactNode }) {
    const { pathname } = useLocation()
    const isSelfManaged = SELF_MANAGED.has(pathname)

    if (isSelfManaged) {
        return (
            <div className="flex min-h-screen flex-col">
                {children}
                <BottomNavigation />
                <PwaInstallBanner />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Navbar />
            {/* pb-24 keeps content above the fixed bottom nav on mobile */}
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 sm:px-6 lg:pb-8 xl:px-8">
                {children}
            </main>
            <BottomNavigation />
            <PwaInstallBanner />
        </div>
    )
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route
                path="/login"
                element={isAuthed() ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
                path="/signup"
                element={isAuthed() ? <Navigate to="/dashboard" replace /> : <SignUp />}
            />

            {/* Protected — each route declared explicitly so React Router can statically analyse them */}
            <Route path="/dashboard"     element={<ProtectedRoute><AppShell><Dashboard /></AppShell></ProtectedRoute>} />
            <Route path="/notes"         element={<ProtectedRoute><AppShell><NotesUpload /></AppShell></ProtectedRoute>} />
            <Route path="/my-notes"      element={<ProtectedRoute><AppShell><MyNotes /></AppShell></ProtectedRoute>} />
            <Route path="/timetable"     element={<ProtectedRoute><AppShell><Timetable /></AppShell></ProtectedRoute>} />
            <Route path="/assignments"   element={<ProtectedRoute><AppShell><Assignments /></AppShell></ProtectedRoute>} />
            <Route path="/profile"       element={<ProtectedRoute><AppShell><Profile /></AppShell></ProtectedRoute>} />
            <Route path="/announcements" element={<ProtectedRoute><AppShell><Announcements /></AppShell></ProtectedRoute>} />
            <Route path="/events"        element={<ProtectedRoute><AppShell><Events /></AppShell></ProtectedRoute>} />
            <Route path="/facilities"    element={<ProtectedRoute><AppShell><Facilities /></AppShell></ProtectedRoute>} />
            <Route path="/assistant"     element={<ProtectedRoute><AppShell><Assistant /></AppShell></ProtectedRoute>} />
            <Route path="/courses"       element={<ProtectedRoute><AppShell><Courses /></AppShell></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

function App() {
    return (
        <UserProvider>
            <AppRoutes />
        </UserProvider>
    )
}

export default App