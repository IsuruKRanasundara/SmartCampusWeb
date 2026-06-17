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

const PRIMARY_ITEMS = [
    { label: 'Home', icon: <FaHome />, href: '/dashboard' },
    { label: 'Tasks', icon: <FaClipboardList />, href: '/assignments' },
    { label: 'Notes', icon: <FaFileAlt />, href: '/my-notes' },
    { label: 'Schedule', icon: <FaCalendarAlt />, href: '/timetable' },
    { label: 'Profile', icon: <FaUserCircle />, href: '/profile' },
]

const SECONDARY_ITEMS = [
    { label: 'Courses', icon: <FaBookOpen />, href: '/courses' },
    { label: 'Notices', icon: <FaBullhorn />, href: '/announcements' },
    { label: 'Events', icon: <FaCalendarCheck />, href: '/events' },
    { label: 'Facilities', icon: <FaBuilding />, href: '/facilities' },
    { label: 'Assistant', icon: <FaRobot />, href: '/assistant' },
    { label: 'Upload', icon: <FaFileAlt />, href: '/notes' },
]

export default function BottomNavigation() {
    const currentPath = window.location.pathname
    const [trayOpen, setTrayOpen] = useState(false)
    const isSecondaryActive = SECONDARY_ITEMS.some((i) => i.href === currentPath)

    return (
        <>
            {/* Slide-up tray */}
            {trayOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
                        onClick={() => setTrayOpen(false)}
                    />
                    <div
                        className="fixed left-0 right-0 z-40 mx-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60 lg:hidden"
                        style={{
                            bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))',
                            animation: 'trayIn 0.22s cubic-bezier(.32,1.1,.6,1)',
                        }}
                    >
                        <style>{`
                            @keyframes trayIn {
                                from { opacity:0; transform:translateY(16px) }
                                to   { opacity:1; transform:translateY(0) }
                            }
                        `}</style>
                        <div className="p-3">
                            <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
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
                                            className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-xs font-semibold transition active:scale-95 ${
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

            {/* Bottom bar */}
            <nav
                className="fixed left-0 right-0 z-50 border-t border-slate-200/80 bg-white/98 shadow-[0_-8px_32px_-8px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden"
                style={{
                    bottom: 0,
                    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                }}
            >
                <div className="mx-auto grid max-w-lg grid-cols-6 gap-0 px-1 py-1">
                    {PRIMARY_ITEMS.map((item) => {
                        const isActive = currentPath === item.href
                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl py-2.5 text-[10px] font-semibold transition-all duration-150 active:scale-95 ${
                                    isActive
                                        ? 'text-blue-700'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <span className={`flex h-7 w-7 items-center justify-center rounded-xl text-sm transition-all ${
                                    isActive ? 'bg-blue-50 text-blue-700' : ''
                                }`}>
                                    {item.icon}
                                </span>
                                <span className="truncate">{item.label}</span>
                            </a>
                        )
                    })}

                    {/* More toggle */}
                    <button
                        onClick={() => setTrayOpen((o) => !o)}
                        className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl py-2.5 text-[10px] font-semibold transition-all duration-150 active:scale-95 ${
                            trayOpen || isSecondaryActive
                                ? 'text-blue-700'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                        aria-expanded={trayOpen}
                        aria-label="More navigation options"
                    >
                        <span className={`flex h-7 w-7 items-center justify-center rounded-xl text-sm transition-all ${
                            trayOpen || isSecondaryActive ? 'bg-blue-50 text-blue-700' : ''
                        }`}>
                            {trayOpen ? <FaChevronDown /> : <FaTh />}
                        </span>
                        <span>{trayOpen ? 'Close' : 'More'}</span>
                    </button>
                </div>
            </nav>
        </>
    )
}