import { useCallback, useEffect, useState } from 'react'
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaRedo,
    FaWifi,
    FaExclamationTriangle,
} from 'react-icons/fa'
import {
    FALLBACK_WEEKLY_TIMETABLE,
    getCurrentWeekday,
    WEEKDAYS,
    type Weekday,
} from '../data/weeklyTimetable'
import { api, parseTimeRange, type ApiTimetableEntry } from '../utils/api'

export default function Timetable() {
    const today = getCurrentWeekday()
    const [selectedDay, setSelectedDay] = useState<Weekday>(today)
    const [scheduleByDay, setScheduleByDay] = useState<Partial<Record<Weekday, ApiTimetableEntry[]>>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch timetable for the requested day from the API
    const fetchTimetable = useCallback(async (day: Weekday) => {
        setLoading(true)
        setError(null)
        try {
            const endpoint = day === today ? '/api/timetable/today' : `/api/timetable/day/${day}`
            const entries = await api.get<ApiTimetableEntry[]>(endpoint)
            setScheduleByDay(prev => ({ ...prev, [day]: entries }))
        } catch (err) {
            console.error('Timetable fetch error:', err)
            setError('Could not reach the server — showing cached schedule.')
            setScheduleByDay(prev => ({ ...prev, [day]: FALLBACK_WEEKLY_TIMETABLE[day] ?? [] }))
        } finally {
            setLoading(false)
        }
    }, [today])

    useEffect(() => {
        void fetchTimetable(selectedDay)
    }, [fetchTimetable, selectedDay])

    const sessions: ApiTimetableEntry[] =
        scheduleByDay[selectedDay] ?? []

    const dateLabel = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    // Determine now-badge for today's sessions
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()

    function getSessionStatus(time: string): 'now' | 'next' | 'past' | 'upcoming' {
        const { startTime, endTime } = parseTimeRange(time)
        const start = timeToMinutes(startTime)
        const end = timeToMinutes(endTime)
        if (nowMinutes >= start && nowMinutes < end) return 'now'
        if (nowMinutes < start) return 'upcoming'
        return 'past'
    }

    function timeToMinutes(t: string): number {
        const match = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
        if (!match) return 0
        let h = parseInt(match[1], 10)
        const m = parseInt(match[2], 10)
        const p = match[3]?.toUpperCase()
        if (p === 'PM' && h !== 12) h += 12
        if (p === 'AM' && h === 12) h = 0
        return h * 60 + m
    }

    // Find the first upcoming session index for "Next" badge
    let nextIdx = -1
    if (selectedDay === today) {
        sessions.forEach((s, i) => {
            const st = getSessionStatus(s.time)
            if (st === 'upcoming' && nextIdx === -1) nextIdx = i
        })
    }

    return (
        <main className="relative min-h-screen bg-slate-50 text-slate-900">
            <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-transparent" />

            {/* Sticky header */}
            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
                    <a href="/dashboard" className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                            <FaWifi />
                        </span>
                        <span className="min-w-0">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600">Smart Campus</span>
                            <span className="block truncate text-sm font-semibold text-slate-900">Timetable</span>
                        </span>
                    </a>
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => void fetchTimetable(selectedDay)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
                            title="Refresh timetable"
                            disabled={loading}
                        >
                            <FaRedo className={loading ? 'animate-spin text-blue-500' : ''} />
                        </button>
                        <a
                            href="/dashboard"
                            className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <FaArrowLeft className="text-xs" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </a>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8 lg:py-8">
                {/* Hero */}
                <section className="mb-5 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-5 text-white shadow-xl shadow-blue-200/60 lg:p-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100/90">Weekly schedule</p>
                    <h1 className="mt-1.5 text-xl font-semibold tracking-tight lg:text-3xl">Your class timetable</h1>
                    <p className="mt-1 text-xs text-blue-100 lg:text-sm">{dateLabel}</p>
                    {selectedDay in scheduleByDay && !error && (
                        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white ring-1 ring-white/20">
                            <FaCalendarAlt className="text-[10px]" />
                            Live from server
                        </p>
                    )}
                </section>

                {/* Error banner */}
                {error && (
                    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <FaExclamationTriangle className="mt-0.5 shrink-0 text-amber-500" />
                        <span className="flex-1">{error}</span>
                        <button
                            type="button"
                            onClick={() => void fetchTimetable(selectedDay)}
                            className="shrink-0 font-semibold underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Day selector — horizontal scroll on mobile */}
                <div className="mb-5 -mx-4 px-4 lg:mx-0 lg:px-0">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {WEEKDAYS.map((day) => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => setSelectedDay(day)}
                                className={`shrink-0 rounded-2xl px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                                    selectedDay === day
                                        ? 'bg-gradient-to-r from-blue-700 to-sky-500 text-white shadow-md shadow-blue-200/60'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600'
                                }`}
                            >
                                <span className="sm:hidden">{day.slice(0, 3)}</span>
                                <span className="hidden sm:inline">{day}</span>
                                {day === today && (
                                    <span className="ml-1.5 rounded-full bg-white/25 px-1.5 py-0.5 text-[9px]">Today</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Session list */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">{selectedDay}</h2>
                            <p className="text-sm text-slate-500">
                                {loading && selectedDay === today
                                    ? 'Loading…'
                                    : `${sessions.length} session${sessions.length === 1 ? '' : 's'}`}
                            </p>
                        </div>
                        <FaCalendarAlt className="text-lg text-blue-600" />
                    </div>

                    {loading && selectedDay === today ? (
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5">
                                    <div className="h-4 w-1/2 rounded bg-slate-100" />
                                    <div className="mt-3 h-3 w-1/3 rounded bg-slate-100" />
                                    <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
                                </div>
                            ))}
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
                            <FaCalendarAlt className="mx-auto text-3xl text-slate-200" />
                            <p className="mt-4 text-sm font-semibold text-slate-700">No classes on {selectedDay}</p>
                            <p className="mt-1 text-xs text-slate-400">Enjoy your free day!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sessions.map((session, index) => {
                                const { startTime, endTime } = parseTimeRange(session.time)
                                const isToday = selectedDay === today
                                const status = isToday ? getSessionStatus(session.time) : 'upcoming'
                                const isNext = isToday && index === nextIdx
                                const isNow = status === 'now'
                                const isPast = status === 'past'

                                return (
                                    <article
                                        key={`${session.course}-${index}`}
                                        className={`rounded-3xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg lg:p-5 ${
                                            isNow
                                                ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white ring-1 ring-emerald-100'
                                                : isNext
                                                    ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white ring-1 ring-blue-100'
                                                    : isPast
                                                        ? 'border-slate-100 bg-slate-50/60 opacity-70'
                                                        : 'border-slate-200 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-sm font-semibold text-slate-900 lg:text-base">
                                                        {session.course}
                                                    </h3>
                                                    {isNow && (
                                                        <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                                            Now
                                                        </span>
                                                    )}
                                                    {isNext && !isNow && (
                                                        <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                                            Next
                                                        </span>
                                                    )}
                                                    {isPast && isToday && (
                                                        <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                            Done
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <FaClock className="mt-0.5 shrink-0 text-slate-300" />
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
                                            <span className="flex items-center gap-1.5">
                                                <FaClock className={`shrink-0 ${isNow ? 'text-emerald-500' : 'text-blue-500'}`} />
                                                {startTime} – {endTime}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FaMapMarkerAlt className={`shrink-0 ${isNow ? 'text-emerald-500' : 'text-blue-500'}`} />
                                                {session.hall}
                                            </span>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}