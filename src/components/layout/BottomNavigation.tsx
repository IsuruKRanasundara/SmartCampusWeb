import { useState } from 'react'
import {
    FaCalendarAlt,
    FaClipboardList,
    FaFileAlt,
    FaHome,
    FaUserCircle,
    FaBullhorn,
    FaCalendarCheck,
    FaBuilding,
    FaRobot,
    FaBookOpen,
    FaTh,
    FaChevronDown,
} from 'react-icons/fa'

// Primary 5 — always in the bottom bar
const PRIMARY_ITEMS = [
    { label: 'Home', icon: <FaHome />, href: '/dashboard' },
    { label: 'Assignments', icon: <FaClipboardList />, href: '/assignments' },
    { label: 'Notes', icon: <FaFileAlt />, href: '/my-notes' },
    { label: 'Timetable', icon: <FaCalendarAlt />, href: '/timetable' },
    { label: 'Profile', icon: <FaUserCircle />, href: '/profile' },
]

// Secondary 6 — in the slide-up "More" tray
const SECONDARY_ITEMS = [
    { label: 'Courses', icon: <FaBookOpen />, href: '/courses' },
    { label: 'Announcements', icon: <FaBullhorn />, href: '/announcements' },
    { label: 'Events', icon: <FaCalendarCheck />, href: '/events' },
    { label: 'Facilities', icon: <FaBuilding />, href: '/facilities' },
    { label: 'Assistant', icon: <FaRobot />, href: '/assistant' },
    { label: 'Upload Notes', icon: <FaFileAlt />, href: '/notes' },
]

/**
 * Mobile bottom navigation bar.
 * - 5 primary items always visible.
 * - A "More" toggle opens a slide-up tray with the remaining 6 pages.
 */
export default function BottomNavigation() {
    const currentPath = window.location.pathname
    const [trayOpen, setTrayOpen] = useState(false)

    const isSecondaryActive = SECONDARY_ITEMS.some((i) => i.href === currentPath)

    return (
        <>
            {/* Slide-up tray overlay */}
            {trayOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-20 bg-slate-900/20 backdrop-blur-sm lg:hidden"
                        onClick={() => setTrayOpen(false)}
                    />

                    {/* Tray */}
                    <div
                        className="fixed bottom-[4.5rem] left-0 right-0 z-20 mx-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60 lg:hidden"
                        style={{ animation: 'trayIn 0.22s cubic-bezier(.32,1.1,.6,1)' }}
                    >
                        <style>{`
                            @keyframes trayIn {
                                from { opacity:0; transform:translateY(16px) }
                                to   { opacity:1; transform:translateY(0) }
                            }
                        `}</style>

                        <div className="p-2">
                            <p className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                More Pages
                            </p>
                            <div className="grid grid-cols-3 gap-1.5">
                                {SECONDARY_ITEMS.map((item) => {
                                    const isActive = currentPath === item.href
                                    return (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setTrayOpen(false)}
                                            className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-xs font-semibold transition ${
                                                isActive
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                        >
                                            <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-base ${
                                                isActive
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {item.icon}
                                            </span>
                                            <span className="text-center leading-tight">{item.label}</span>
                                        </a>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Primary bottom bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 bg-white/95 px-3 py-3 shadow-[0_-12px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:hidden">
                <div className="mx-auto grid max-w-7xl grid-cols-6 gap-1">
                    {PRIMARY_ITEMS.map((item) => {
                        const isActive = currentPath === item.href
                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-semibold transition duration-200 ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span>{item.label}</span>
                            </a>
                        )
                    })}

                    {/* More toggle */}
                    <button
                        onClick={() => setTrayOpen((o) => !o)}
                        className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-semibold transition duration-200 ${
                            trayOpen || isSecondaryActive
                                ? 'bg-blue-50 text-blue-700 shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                        aria-expanded={trayOpen}
                        aria-label="More navigation options"
                    >
                        <span className="text-base">
                            {trayOpen ? <FaChevronDown /> : <FaTh />}
                        </span>
                        <span>{trayOpen ? 'Close' : 'More'}</span>
                    </button>
                </div>
            </nav>
        </>
    )
}