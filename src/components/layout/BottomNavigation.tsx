import {
    FaCalendarAlt,
    FaClipboardList,
    FaFileAlt,
    FaHome,
    FaUserCircle,
} from 'react-icons/fa'

const NAV_ITEMS = [
    { label: 'Home', icon: <FaHome />, href: '/dashboard' },
    { label: 'Assignments', icon: <FaClipboardList />, href: '/assignments' },
    { label: 'Notes', icon: <FaFileAlt />, href: '/my-notes' },
    { label: 'Timetable', icon: <FaCalendarAlt />, href: '/timetable' },
    { label: 'Profile', icon: <FaUserCircle />, href: '/profile' },
]

/**
 * Mobile bottom navigation bar.
 *
 * Automatically highlights the item matching `window.location.pathname`.
 * Accepts an optional `items` prop to override the default set.
 */
export default function BottomNavigation({
                                             items = NAV_ITEMS,
                                         }: {
    items?: { label: string; icon: React.ReactNode; href: string }[]
}) {
    const currentPath = window.location.pathname

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 bg-white/95 px-3 py-3 shadow-[0_-12px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:hidden">
            <div className="mx-auto grid max-w-7xl grid-cols-5 gap-1">
                {items.map((item) => {
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
            </div>
        </nav>
    )
}
