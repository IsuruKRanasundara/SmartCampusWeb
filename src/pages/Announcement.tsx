import {useCallback, useEffect, useState} from 'react'
import {
    FaArrowLeft,
    FaBullhorn,
    FaFilter,
    FaRedo,
    FaWifi,
    FaExclamationCircle,
    FaInfoCircle,
    FaCheckCircle,
} from 'react-icons/fa'

const API_BASE = 'https://smart-campus-web-api.vercel.app'

interface Announcement {
    id: number
    title: string
    description: string
    category: string
    priority: 'low' | 'medium' | 'high'
    author: string
    createdAt: string
    updatedAt: string
}

const PRIORITY_CONFIG = {
    high: {
        label: 'Urgent',
        badge: 'bg-rose-50 text-rose-700 ring-rose-200',
        icon: <FaExclamationCircle className="text-rose-500"/>,
        border: 'border-l-4 border-l-rose-400',
    },
    medium: {
        label: 'Important',
        badge: 'bg-amber-50 text-amber-700 ring-amber-200',
        icon: <FaInfoCircle className="text-amber-500"/>,
        border: 'border-l-4 border-l-amber-400',
    },
    low: {
        label: 'Info',
        badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        icon: <FaCheckCircle className="text-emerald-500"/>,
        border: 'border-l-4 border-l-emerald-400',
    },
}

const CATEGORIES = ['All', 'Academic', 'Exams', 'Facility', 'General']

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export default function Announcements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
    const [expandedId, setExpandedId] = useState<number | null>(null)

    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token') || localStorage.getItem('smart-campus-token') || ''
            : ''

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE}/api/announcements`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Failed to fetch')
            setAnnouncements(data.data as Announcement[])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load announcements')
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        void fetchAnnouncements()
    }, [fetchAnnouncements])

    const filtered = announcements.filter((a) => {
        const matchCat = categoryFilter === 'All' || a.category === categoryFilter
        const matchPri = priorityFilter === 'all' || a.priority === priorityFilter
        return matchCat && matchPri
    })

    const highCount = announcements.filter((a) => a.priority === 'high').length

    return (
        <main className="relative min-h-screen bg-slate-50 text-slate-900">
            <div
                className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-transparent"/>

            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
                    <a href="/dashboard" className="flex items-center gap-3">
                        <span
                            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                            <FaWifi className="text-lg"/>
                        </span>
                        <span>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-blue-600">Smart Campus</span>
                            <span
                                className="block text-sm font-semibold leading-tight text-slate-900">Announcements</span>
                        </span>
                    </a>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => void fetchAnnouncements()}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            title="Refresh"
                        >
                            <FaRedo className={loading ? 'animate-spin' : ''}/>
                        </button>
                        <a
                            href="/dashboard"
                            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <FaArrowLeft className="text-xs"/>
                            Dashboard
                        </a>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8 lg:py-8">
                {/* Hero */}
                <section
                    className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-xl shadow-blue-200/60 lg:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100/90">Campus Updates</p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight lg:text-3xl">Announcements</h1>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <div className="rounded-2xl bg-white/15 px-4 py-2 text-center">
                            <p className="text-xl font-semibold">{announcements.length}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-100">Total</p>
                        </div>
                        <div className="rounded-2xl bg-white/15 px-4 py-2 text-center">
                            <p className="text-xl font-semibold text-rose-300">{highCount}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-100">Urgent</p>
                        </div>
                    </div>
                </section>

                {error && (
                    <div
                        className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <FaExclamationCircle className="shrink-0 text-amber-500"/>
                        {error}
                        <button onClick={() => void fetchAnnouncements()}
                                className="ml-auto font-semibold underline">Retry
                        </button>
                    </div>
                )}

                {/* Filters */}
                <div className="mb-5 flex flex-col gap-3">
                    {/* Category pills */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategoryFilter(cat)}
                                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                                    categoryFilter === cat
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200/50'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    {/* Priority pills */}
                    <div className="flex gap-2">
                        <FaFilter className="mt-2.5 shrink-0 text-xs text-slate-400"/>
                        {(['all', 'high', 'medium', 'low'] as const).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPriorityFilter(p)}
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                                    priorityFilter === p
                                        ? 'bg-slate-800 text-white'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {p === 'all' ? 'All priorities' : p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({length: 3}).map((_, i) => (
                            <div key={i} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5">
                                <div className="h-4 w-1/3 rounded bg-slate-100"/>
                                <div className="mt-3 h-3 w-2/3 rounded bg-slate-100"/>
                                <div className="mt-2 h-3 w-1/2 rounded bg-slate-100"/>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <FaBullhorn className="mx-auto text-3xl text-slate-300"/>
                        <p className="mt-4 text-sm font-semibold text-slate-700">No announcements found</p>
                        <p className="mt-1 text-xs text-slate-400">Try adjusting the filters above.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((a) => {
                            const cfg = PRIORITY_CONFIG[a.priority]
                            const expanded = expandedId === a.id
                            return (
                                <article
                                    key={a.id}
                                    className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${cfg.border}`}
                                >
                                    <button
                                        type="button"
                                        className="w-full px-5 py-4 text-left"
                                        onClick={() => setExpandedId(expanded ? null : a.id)}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-start gap-3">
                                                <span className="mt-0.5 shrink-0">{cfg.icon}</span>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {a.author} · {a.category} · {formatDate(a.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${cfg.badge}`}>
                                                {cfg.label}
                                            </span>
                                        </div>

                                        {expanded && (
                                            <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-7 text-slate-700">
                                                {a.description}
                                            </p>
                                        )}
                                        <p className="mt-2 text-xs font-medium text-blue-600">
                                            {expanded ? 'Show less ▲' : 'Read more ▼'}
                                        </p>
                                    </button>
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}
