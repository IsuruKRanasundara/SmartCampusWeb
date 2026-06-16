import { useState, useRef, useEffect } from 'react'
import {
    FaBell,
    FaCalendarAlt,
    FaClipboardList,
    FaCog,
    FaHome,
    FaFileAlt,
    FaUserCircle,
    FaWifi,
    FaBullhorn,
    FaCalendarCheck,
    FaBuilding,
    FaRobot,
    FaBookOpen,
    FaChevronDown,
} from 'react-icons/fa'

interface NavbarProps {
    currentTime?: string
    notificationCount?: number
}

// Primary nav (always visible in pill bar)
const primaryNavItems = [
    { label: 'Dashboard', icon: <FaHome />, href: '/dashboard' },
    { label: 'Assignments', icon: <FaClipboardList />, href: '/assignments' },
    { label: 'Notes', icon: <FaFileAlt />, href: '/my-notes' },
    { label: 'Timetable', icon: <FaCalendarAlt />, href: '/timetable' },
    { label: 'Courses', icon: <FaBookOpen />, href: '/courses' },
    { label: 'Profile', icon: <FaUserCircle />, href: '/profile' },
]

// Secondary nav — shown in "More" dropdown
const moreNavItems = [
    { label: 'Announcements', icon: <FaBullhorn />, href: '/announcements' },
    { label: 'Events', icon: <FaCalendarCheck />, href: '/events' },
    { label: 'Facilities', icon: <FaBuilding />, href: '/facilities' },
    { label: 'Assistant', icon: <FaRobot />, href: '/assistant' },
    { label: 'Notes Upload', icon: <FaFileAlt />, href: '/notes' },
]

export default function Navbar({ currentTime, notificationCount = 0 }: NavbarProps) {
    const currentPath = window.location.pathname
    const [moreOpen, setMoreOpen] = useState(false)
    const moreRef = useRef<HTMLDivElement>(null)

    const now = currentTime ?? new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    })

    // Close "More" dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (moreRef.current && e.target instanceof Node && !moreRef.current.contains(e.target)) {
                setMoreOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const isMoreActive = moreNavItems.some((item) => item.href === currentPath)

    return (
        <header className="sticky top-0 z-30 hidden border-b border-slate-200/80 bg-white/85 backdrop-blur-xl lg:block">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 xl:px-8">
                {/* Brand */}
                <div className="flex items-center gap-4">
                    <a
                        href="/dashboard"
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200"
                    >
                        <FaWifi className="text-lg" />
                    </a>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-600">Smart Campus</p>
                        <h1 className="text-sm font-semibold leading-tight text-slate-900">Web Companion</h1>
                    </div>
                    <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200 xl:flex">
                        <FaCalendarAlt className="text-blue-600" />
                        <span>Today</span>
                        <span className="text-slate-300">|</span>
                        <span>{now}</span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3">
                    {/* Primary pill nav */}
                    <nav className="flex items-center gap-1 rounded-full bg-slate-50 p-1 ring-1 ring-slate-200">
                        {primaryNavItems.map((item) => {
                            const isActive = currentPath === item.href
                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        isActive
                                            ? 'bg-white text-blue-700 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    <span>{item.label}</span>
                                </a>
                            )
                        })}

                        {/* More dropdown */}
                        <div ref={moreRef} className="relative">
                            <button
                                onClick={() => setMoreOpen((o) => !o)}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                    isMoreActive || moreOpen
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <span>More</span>
                                <FaChevronDown
                                    className={`text-[10px] transition-transform ${moreOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {moreOpen && (
                                <div
                                    className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/80"
                                    style={{ animation: 'dropdownIn 0.15s ease' }}
                                >
                                    <style>{`@keyframes dropdownIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
                                    <div className="p-1.5">
                                        {moreNavItems.map((item) => {
                                            const isActive = currentPath === item.href
                                            return (
                                                <a
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={() => setMoreOpen(false)}
                                                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                                        isActive
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                                                        isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {item.icon}
                                                    </span>
                                                    {item.label}
                                                </a>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Settings */}
                    <a
                        href="/settings"
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        title="Settings"
                    >
                        <FaCog className="text-base" />
                    </a>

                    {/* Notifications */}
                    <a
                        href="/dashboard"
                        className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        aria-label="Notifications"
                    >
                        <FaBell className="text-lg" />
                        {notificationCount > 0 && (
                            <>
                                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white shadow-lg shadow-blue-200">
                                    {notificationCount}
                                </span>
                            </>
                        )}
                    </a>
                </div>
            </div>
        </header>
    )
}