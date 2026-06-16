import { useCallback, useEffect, useState } from 'react'
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaClock,
    FaUsers,
    FaRedo,
    FaWifi,
    FaExclamationCircle,
    FaCheck,
    FaFilter,
} from 'react-icons/fa'

const API_BASE = 'https://smart-campus-web-api.vercel.app'

interface Event {
    id: number
    name: string
    description: string
    date: string
    time: string
    venue: string
    category: string
    organizer: string
    registeredCount: number
}

const CATEGORY_COLORS: Record<string, string> = {
    Competition: 'bg-violet-50 text-violet-700 ring-violet-200',
    Career: 'bg-blue-50 text-blue-700 ring-blue-200',
    Workshop: 'bg-amber-50 text-amber-700 ring-amber-200',
    General: 'bg-slate-50 text-slate-600 ring-slate-200',
}

const ALL_CATEGORIES = ['All', 'Competition', 'Career', 'Workshop', 'General']

function formatEventDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function isUpcoming(dateStr: string) {
    return new Date(dateStr) >= new Date()
}

export default function Events() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [registeredIds, setRegisteredIds] = useState<Set<number>>(new Set())
    const [registeringId, setRegisteringId] = useState<number | null>(null)
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [upcomingOnly, setUpcomingOnly] = useState(true)

    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token') || localStorage.getItem('smart-campus-token') || ''
            : ''

    const fetchEvents = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams()
            if (upcomingOnly) params.set('upcoming', 'true')
            const res = await fetch(`${API_BASE}/api/events?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Failed to fetch')
            setEvents(data.data as Event[])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load events')
        } finally {
            setLoading(false)
        }
    }, [token, upcomingOnly])

    useEffect(() => { void fetchEvents() }, [fetchEvents])

    const handleRegister = async (eventId: number) => {
        if (registeredIds.has(eventId)) return
        setRegisteringId(eventId)
        try {
            const res = await fetch(`${API_BASE}/api/events/${eventId}/register`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Registration failed')
            setRegisteredIds((prev) => new Set([...prev, eventId]))
            setEvents((prev) =>
                prev.map((e) => (e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e))
            )
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Registration failed')
        } finally {
            setRegisteringId(null)
        }
    }

    const filtered = events.filter((e) => {
        const matchCat = categoryFilter === 'All' || e.category === categoryFilter
        return matchCat
    })

    return (
        <main className="relative min-h-screen bg-slate-50 text-slate-900">
            <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-transparent" />

            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
                    <a href="/dashboard" className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                            <FaWifi className="text-lg" />
                        </span>
                        <span>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-blue-600">Smart Campus</span>
                            <span className="block text-sm font-semibold leading-tight text-slate-900">Campus Events</span>
                        </span>
                    </a>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => void fetchEvents()}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <FaRedo className={loading ? 'animate-spin' : ''} />
                        </button>
                        <a
                            href="/dashboard"
                            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <FaArrowLeft className="text-xs" />
                            Dashboard
                        </a>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8 lg:py-8">
                {/* Hero */}
                <section className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-xl shadow-blue-200/60 lg:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100/90">On campus</p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight lg:text-3xl">Events &amp; Activities</h1>
                    <p className="mt-2 text-sm text-blue-50">
                        {events.length} event{events.length !== 1 ? 's' : ''} found
                        {upcomingOnly ? ' · upcoming only' : ''}
                    </p>
                </section>

                {error && (
                    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <FaExclamationCircle className="shrink-0 text-amber-500" />
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="mb-5 flex flex-col gap-3">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {ALL_CATEGORIES.map((cat) => (
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
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <FaFilter className="text-xs text-slate-400" />
                        <input
                            type="checkbox"
                            checked={upcomingOnly}
                            onChange={(e) => setUpcomingOnly(e.target.checked)}
                            className="rounded"
                        />
                        <span className="font-medium text-slate-700">Upcoming events only</span>
                    </label>
                </div>

                {/* Events grid */}
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5">
                                <div className="h-4 w-1/2 rounded bg-slate-100" />
                                <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />
                                <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <FaCalendarAlt className="mx-auto text-3xl text-slate-300" />
                        <p className="mt-4 text-sm font-semibold text-slate-700">No events found</p>
                        <p className="mt-1 text-xs text-slate-400">Try adjusting filters or uncheck upcoming-only.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((event) => {
                            const upcoming = isUpcoming(event.date)
                            const registered = registeredIds.has(event.id)
                            const catColor = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.General
                            return (
                                <article
                                    key={event.id}
                                    className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                                        upcoming ? 'border-blue-100' : 'border-slate-200 opacity-80'
                                    }`}
                                >
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="text-base font-semibold text-slate-900">{event.name}</h2>
                                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${catColor}`}>
                                                        {event.category}
                                                    </span>
                                                    {!upcoming && (
                                                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                                            Past
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-xs text-slate-500">By {event.organizer}</p>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-sm leading-6 text-slate-700">{event.description}</p>

                                        <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                                            <span className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-blue-500" />
                                                {formatEventDate(event.date)}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <FaClock className="text-blue-500" />
                                                {event.time}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-blue-500" />
                                                {event.venue}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <FaUsers className="text-blue-500" />
                                                {event.registeredCount} registered
                                            </span>
                                        </div>

                                        {upcoming && (
                                            <div className="mt-4">
                                                <button
                                                    type="button"
                                                    disabled={registered || registeringId === event.id}
                                                    onClick={() => void handleRegister(event.id)}
                                                    className={`inline-flex h-10 items-center gap-2 rounded-2xl px-5 text-sm font-semibold transition ${
                                                        registered
                                                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                                            : 'bg-gradient-to-r from-blue-700 to-sky-500 text-white shadow-md hover:opacity-90 disabled:opacity-50'
                                                    }`}
                                                >
                                                    {registered ? (
                                                        <>
                                                            <FaCheck className="text-xs" />
                                                            Registered
                                                        </>
                                                    ) : registeringId === event.id ? (
                                                        'Registering…'
                                                    ) : (
                                                        'Register now'
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}
