import { useCallback, useEffect, useState } from 'react'
import { FaBell, FaSearch, FaTimes } from 'react-icons/fa'

type NotificationType = 'info' | 'assignment' | 'grade'

interface Notification {
    id: number
    message: string
    type: NotificationType
    time: string
    read: boolean
}

interface NotificationsDrawerProps {
    open: boolean
    onClose: () => void
    notifications: Notification[]
}

const typeColor: Record<NotificationType, string> = {
    info: 'bg-blue-100 text-blue-600',
    assignment: 'bg-amber-100 text-amber-600',
    grade: 'bg-emerald-100 text-emerald-600',
}

const typeLabel: Record<NotificationType, string> = {
    info: 'Campus update',
    assignment: 'Assignment',
    grade: 'Grade',
}

export default function NotificationsDrawer({ open, onClose, notifications }: NotificationsDrawerProps) {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    const handleClose = useCallback(() => {
        setSearch('')
        setFilter('all')
        onClose()
    }, [onClose])

    useEffect(() => {
        if (!open) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose()
        }
        document.addEventListener('keydown', onKeyDown)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = ''
        }
    }, [open, handleClose])

    if (!open) return null

    const unreadCount = notifications.filter((n) => !n.read).length
    const filtered = notifications.filter((n) => {
        const matchesSearch =
            n.message.toLowerCase().includes(search.toLowerCase()) ||
            typeLabel[n.type].toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === 'all' || !n.read
        return matchesSearch && matchesFilter
    })

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
                onClick={handleClose}
                aria-hidden="true"
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="All notifications"
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl"
                style={{ animation: 'drawerIn 0.22s ease' }}
            >
                <style>{`@keyframes drawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

                <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
                        <FaBell />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">All Notifications</p>
                        <p className="text-xs text-blue-100">
                            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white transition hover:bg-white/25"
                        aria-label="Close notifications"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="space-y-3 border-b border-slate-100 px-4 py-3">
                    <div className="relative">
                        <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search notifications…"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'unread'] as const).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setFilter(tab)}
                                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                                    filter === tab
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {tab === 'all' ? 'All' : `Unread (${unreadCount})`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 && (
                        <p className="py-12 text-center text-sm text-slate-400">No notifications found</p>
                    )}
                    {filtered.map((n) => (
                        <div
                            key={n.id}
                            className={`flex gap-3 border-b border-slate-50 px-4 py-4 ${
                                !n.read ? 'bg-blue-50/40' : ''
                            }`}
                        >
                            <span
                                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm ${
                                    typeColor[n.type] ?? 'bg-slate-100 text-slate-500'
                                }`}
                            >
                                <FaBell />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        {typeLabel[n.type]}
                                    </p>
                                    <span className="shrink-0 text-[10px] text-slate-400">{n.time}</span>
                                </div>
                                <p className="mt-1 text-sm text-slate-700">{n.message}</p>
                                {!n.read && (
                                    <span className="mt-2 inline-block rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                        New
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </>
    )
}
