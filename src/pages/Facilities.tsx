import { useCallback, useEffect, useState } from 'react'
import {
    FaArrowLeft,
    FaBuilding,
    FaCalendarAlt,
    FaClock,
    FaRedo,
    FaWifi,
    FaExclamationCircle,
    FaCheckCircle,
    FaTimesCircle,
    FaUsers,
    FaFilter,
} from 'react-icons/fa'

const API_BASE = 'https://smart-campus-web-api.vercel.app'

interface Facility {
    id: number
    name: string
    type: string
    capacity: number
    open: boolean
    openHours: string
    location: string
}

interface Booking {
    id: number
    userId: string
    date: string
    startTime: string
    endTime: string
    purpose: string
    status: string
}

const TYPE_COLORS: Record<string, string> = {
    Library:   'bg-blue-50 text-blue-700 ring-blue-200',
    Lab:       'bg-violet-50 text-violet-700 ring-violet-200',
    Sports:    'bg-emerald-50 text-emerald-700 ring-emerald-200',
    Cafeteria: 'bg-amber-50 text-amber-700 ring-amber-200',
    General:   'bg-slate-50 text-slate-600 ring-slate-200',
}

const ALL_TYPES = ['All', 'Library', 'Lab', 'Sports', 'Cafeteria']

export default function Facilities() {
    const [facilities, setFacilities] = useState<Facility[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [typeFilter, setTypeFilter] = useState('All')
    const [openOnly, setOpenOnly] = useState(false)
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [bookings, setBookings] = useState<Record<number, Booking[]>>({})
    const [bookingLoading, setBookingLoading] = useState<number | null>(null)

    // Booking form state
    const [bookingFacilityId, setBookingFacilityId] = useState<number | null>(null)
    const [bookDate, setBookDate] = useState('')
    const [bookStart, setBookStart] = useState('')
    const [bookEnd, setBookEnd] = useState('')
    const [bookPurpose, setBookPurpose] = useState('')
    const [bookingError, setBookingError] = useState('')
    const [bookingSuccess, setBookingSuccess] = useState('')

    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token') || localStorage.getItem('smart-campus-token') || ''
            : ''

    const fetchFacilities = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams()
            if (openOnly) params.set('open', 'true')
            const res = await fetch(`${API_BASE}/api/facilities?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Failed to fetch')
            const list = Array.isArray(data) ? data : (data.data ?? [])
            setFacilities(list as Facility[])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load facilities')
        } finally {
            setLoading(false)
        }
    }, [token, openOnly])

    useEffect(() => { void fetchFacilities() }, [fetchFacilities])

    const loadBookings = async (facilityId: number) => {
        if (bookings[facilityId]) return // already loaded
        setBookingLoading(facilityId)
        try {
            const res = await fetch(`${API_BASE}/api/facilities/${facilityId}/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            const list = Array.isArray(data) ? data : (data.data ?? [])
            setBookings(prev => ({ ...prev, [facilityId]: list as Booking[] }))
        } catch {
            setBookings(prev => ({ ...prev, [facilityId]: [] }))
        } finally {
            setBookingLoading(null)
        }
    }

    const handleExpand = (id: number) => {
        if (expandedId === id) {
            setExpandedId(null)
        } else {
            setExpandedId(id)
            void loadBookings(id)
        }
    }

    const handleBook = async (facilityId: number) => {
        setBookingError('')
        setBookingSuccess('')
        if (!bookDate || !bookStart || !bookEnd) {
            setBookingError('Date, start time and end time are required.')
            return
        }
        try {
            const userId = localStorage.getItem('smart-campus-user-id') || 'user'
            const res = await fetch(`${API_BASE}/api/facilities/${facilityId}/book`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, date: bookDate, startTime: bookStart, endTime: bookEnd, purpose: bookPurpose }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Booking failed')
            setBookingSuccess('Booking confirmed!')
            setBookDate(''); setBookStart(''); setBookEnd(''); setBookPurpose('')
            setBookingFacilityId(null)
            // Refresh bookings for this facility
            setBookings(prev => { const n = { ...prev }; delete n[facilityId]; return n })
            void loadBookings(facilityId)
        } catch (err) {
            setBookingError(err instanceof Error ? err.message : 'Booking failed')
        }
    }

    const filtered = facilities.filter(f => {
        const matchType = typeFilter === 'All' || f.type === typeFilter
        const matchOpen = !openOnly || f.open
        return matchType && matchOpen
    })

    const openCount = facilities.filter(f => f.open).length

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
                            <span className="block text-sm font-semibold leading-tight text-slate-900">Facilities</span>
                        </span>
                    </a>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => void fetchFacilities()}
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
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100/90">Campus</p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight lg:text-3xl">Facilities &amp; Bookings</h1>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <div className="rounded-2xl bg-white/15 px-4 py-2 text-center">
                            <p className="text-xl font-semibold">{facilities.length}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-100">Total</p>
                        </div>
                        <div className="rounded-2xl bg-white/15 px-4 py-2 text-center">
                            <p className="text-xl font-semibold text-emerald-300">{openCount}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-100">Open Now</p>
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <FaExclamationCircle className="shrink-0 text-amber-500" />
                        {error}
                        <button onClick={() => void fetchFacilities()} className="ml-auto font-semibold underline">Retry</button>
                    </div>
                )}

                {/* Filters */}
                <div className="mb-5 flex flex-col gap-3">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {ALL_TYPES.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTypeFilter(t)}
                                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                                    typeFilter === t
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200/50'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <FaFilter className="text-xs text-slate-400" />
                        <input
                            type="checkbox"
                            checked={openOnly}
                            onChange={(e) => setOpenOnly(e.target.checked)}
                            className="rounded"
                        />
                        <span className="font-medium text-slate-700">Open facilities only</span>
                    </label>
                </div>

                {/* Facility list */}
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
                        <FaBuilding className="mx-auto text-3xl text-slate-300" />
                        <p className="mt-4 text-sm font-semibold text-slate-700">No facilities found</p>
                        <p className="mt-1 text-xs text-slate-400">Try adjusting the filters above.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((facility) => {
                            const typeColor = TYPE_COLORS[facility.type] ?? TYPE_COLORS.General
                            const isExpanded = expandedId === facility.id
                            const facilityBookings = bookings[facility.id] ?? []

                            return (
                                <article
                                    key={facility.id}
                                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="text-base font-semibold text-slate-900">{facility.name}</h2>
                                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${typeColor}`}>
                                                        {facility.type}
                                                    </span>
                                                    {facility.open ? (
                                                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                                                            <FaCheckCircle className="text-[8px]" /> Open
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700 ring-1 ring-rose-200">
                                                            <FaTimesCircle className="text-[8px]" /> Closed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                                            <span className="flex items-center gap-2">
                                                <FaBuilding className="text-blue-500" />
                                                {facility.location}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <FaUsers className="text-blue-500" />
                                                Capacity: {facility.capacity}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <FaClock className="text-blue-500" />
                                                {facility.openHours}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            {facility.open && (
                                                <button
                                                    type="button"
                                                    onClick={() => { setBookingFacilityId(bookingFacilityId === facility.id ? null : facility.id); setBookingError(''); setBookingSuccess('') }}
                                                    className="inline-flex h-9 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-sky-500 px-4 text-xs font-semibold text-white shadow-md hover:opacity-90 transition"
                                                >
                                                    <FaCalendarAlt className="text-[10px]" />
                                                    Book now
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleExpand(facility.id)}
                                                className="inline-flex h-9 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600 transition"
                                            >
                                                {isExpanded ? 'Hide bookings ▲' : 'View bookings ▼'}
                                            </button>
                                        </div>

                                        {/* Inline booking form */}
                                        {bookingFacilityId === facility.id && (
                                            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                                <p className="mb-3 text-sm font-semibold text-blue-900">Book {facility.name}</p>
                                                {bookingError && <p className="mb-2 text-xs text-rose-600">{bookingError}</p>}
                                                {bookingSuccess && <p className="mb-2 text-xs text-emerald-600">{bookingSuccess}</p>}
                                                <div className="grid gap-2 sm:grid-cols-3">
                                                    <div>
                                                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Date</label>
                                                        <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)}
                                                               className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Start</label>
                                                        <input type="time" value={bookStart} onChange={e => setBookStart(e.target.value)}
                                                               className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">End</label>
                                                        <input type="time" value={bookEnd} onChange={e => setBookEnd(e.target.value)}
                                                               className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Purpose (optional)</label>
                                                    <input type="text" value={bookPurpose} onChange={e => setBookPurpose(e.target.value)} placeholder="e.g. Group study session"
                                                           className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                                                </div>
                                                <div className="mt-3 flex gap-2">
                                                    <button type="button" onClick={() => void handleBook(facility.id)}
                                                            className="inline-flex h-8 items-center rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700 transition">
                                                        Confirm booking
                                                    </button>
                                                    <button type="button" onClick={() => { setBookingFacilityId(null); setBookingError(''); setBookingSuccess('') }}
                                                            className="inline-flex h-8 items-center rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Bookings list */}
                                        {isExpanded && (
                                            <div className="mt-4 border-t border-slate-100 pt-4">
                                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Current Bookings</p>
                                                {bookingLoading === facility.id ? (
                                                    <p className="text-xs text-slate-400">Loading bookings…</p>
                                                ) : facilityBookings.length === 0 ? (
                                                    <p className="text-xs text-slate-400">No bookings yet.</p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {facilityBookings.map(b => (
                                                            <div key={b.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                                                <span className="flex items-center gap-1.5">
                                                                    <FaCalendarAlt className="text-blue-400" />
                                                                    {b.date} · {b.startTime} – {b.endTime}
                                                                </span>
                                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${b.status === 'cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}>
                                                                    {b.status ?? 'confirmed'}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
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