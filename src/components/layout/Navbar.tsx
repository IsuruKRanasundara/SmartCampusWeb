import { useState, useRef, useEffect, useCallback } from 'react'
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
import NotificationsDrawer from '../../components/NotificationsDrawer'

// ─── Types ────────────────────────────────────────────────────────────────────

type NotificationType = 'info' | 'assignment' | 'grade'

export interface NavbarNotification {
    id: number
    message: string
    type: NotificationType
    time: string
    read: boolean
}

interface NavbarProps {
    currentTime?: string
    notifications?: NavbarNotification[]
    onViewAllNotifications?: () => void
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const primaryNavItems = [
    { label: 'Dashboard',    icon: <FaHome />,         href: '/dashboard' },
    { label: 'Assignments',  icon: <FaClipboardList />, href: '/assignments' },
    { label: 'Notes',        icon: <FaFileAlt />,       href: '/my-notes' },
    { label: 'Timetable',    icon: <FaCalendarAlt />,   href: '/timetable' },
    { label: 'Courses',      icon: <FaBookOpen />,      href: '/courses' },
    { label: 'Profile',      icon: <FaUserCircle />,    href: '/profile' },
]

const moreNavItems = [
    { label: 'Announcements', icon: <FaBullhorn />,      href: '/announcements' },
    { label: 'Events',        icon: <FaCalendarCheck />, href: '/events' },
    { label: 'Facilities',    icon: <FaBuilding />,      href: '/facilities' },
    { label: 'Assistant',     icon: <FaRobot />,         href: '/assistant' },
    { label: 'Notes Upload',  icon: <FaFileAlt />,       href: '/notes' },
]

// ─── Notifications Panel ──────────────────────────────────────────────────────

function NotificationsPanel({
                                notifications,
                                onClose,
                                onViewAll,
                            }: {
    notifications: NavbarNotification[]
    onClose: () => void
    onViewAll: () => void
}) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [onClose])

    const typeColor: Record<NotificationType, string> = {
        info:       'bg-blue-100 text-blue-600',
        assignment: 'bg-amber-100 text-amber-600',
        grade:      'bg-emerald-100 text-emerald-600',
    }

    const unread = notifications.filter((n) => !n.read).length

    return (
        <div
            ref={ref}
            className="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80"
            style={{ animation: 'dropdownIn 0.18s ease' }}
        >
            <style>{`@keyframes dropdownIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="font-semibold text-slate-900">Notifications</p>
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    {unread} new
                </span>
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">No notifications</p>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`flex gap-3 border-b border-slate-50 px-4 py-3 ${!n.read ? 'bg-blue-50/40' : ''}`}
                        >
                            <span
                                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs ${
                                    typeColor[n.type] ?? 'bg-slate-100 text-slate-500'
                                }`}
                            >
                                <FaBell />
                            </span>
                            <div>
                                <p className="text-sm text-slate-700">{n.message}</p>
                                <p className="mt-0.5 text-xs text-slate-400">{n.time}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 p-2">
                <button
                    type="button"
                    onClick={() => {
                        onViewAll()
                        onClose()
                    }}
                    className="block w-full rounded-2xl px-3 py-2 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                    View all notifications
                </button>
            </div>
        </div>
    )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar({
                                   currentTime,
                                   notifications = [],
                                   onViewAllNotifications,
                               }: NavbarProps) {
    const currentPath = window.location.pathname

    const [moreOpen,              setMoreOpen]              = useState(false)
    const [notificationsOpen,     setNotificationsOpen]     = useState(false)
    const [showAllNotifications,  setShowAllNotifications]  = useState(false)

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
    const unreadCount  = notifications.filter((n) => !n.read).length

    // Stable callbacks so NotificationsPanel doesn't re-register its listener on every render
    const closeNotifications = useCallback(() => setNotificationsOpen(false), [])

    const closeAllNotifications = useCallback(() => setShowAllNotifications(false), [])

    // Opens the full drawer, calls any external handler, and closes the dropdown
    const openAllNotifications = useCallback(() => {
        setShowAllNotifications(true)
        setNotificationsOpen(false)
        onViewAllNotifications?.()
    }, [onViewAllNotifications])

    return (
        <>
            <header className="sticky top-0 z-30 hidden border-b border-slate-200/80 bg-white/85 backdrop-blur-xl lg:block">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 xl:px-8">

                    {/* ── Brand ─────────────────────────────────────────────────── */}
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

                    {/* ── Navigation + actions ──────────────────────────────────── */}
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
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen((v) => !v)}
                                className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                aria-label="Notifications"
                            >
                                <FaBell className="text-base" />
                                {unreadCount > 0 && (
                                    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-rose-500 text-[8px] font-bold text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {notificationsOpen && (
                                <NotificationsPanel
                                    notifications={notifications}
                                    onClose={closeNotifications}
                                    onViewAll={openAllNotifications}
                                />
                            )}
                        </div>

                    </div>
                </div>
            </header>

            {/* ── Notifications Drawer ─────────────────────────────────────────── */}
            <NotificationsDrawer
                open={showAllNotifications}
                onClose={closeAllNotifications}
                notifications={notifications}
            />
        </>
    )
}