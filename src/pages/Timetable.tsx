import { useCallback, useEffect, useState } from 'react'
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaRedo,
    FaWifi,
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
    const [todayFromApi, setTodayFromApi] = useState<ApiTimetableEntry[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchTimetable = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const entries = await api.get<ApiTimetableEntry[]>('/api/timetable/today')
            setTodayFromApi(entries)
        } catch (err) {
            console.error('Timetable fetch error:', err)
            setError(err instanceof Error ? err.message : 'Failed to load timetable')
            setTodayFromApi(FALLBACK_WEEKLY_TIMETABLE[today])
        } finally {
            setLoading(false)
        }
    }, [today])

    useEffect(() => {
        let cancelled = false

        api.get<ApiTimetableEntry[]>('/api/timetable/today')
            .then((entries) => {
                if (!cancelled) {
                    setTodayFromApi(entries)
                    setError(null)
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    console.error('Timetable fetch error:', err)
                    setError(err instanceof Error ? err.message : 'Failed to load timetable')
                    setTodayFromApi(FALLBACK_WEEKLY_TIMETABLE[today])
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [today])

    const sessions =
        selectedDay === today && todayFromApi
            ? todayFromApi
            : FALLBACK_WEEKLY_TIMETABLE[selectedDay]

    const dateLabel = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    return (
        <main className="relative min-h-screen bg-slate-50 text-slate-900">
            <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-transparent" />

            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
                    <a href="/dashboard" className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                            <FaWifi className="text-lg" />
                        </span>
                        <span>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-blue-600">
                                Smart Campus
                            </span>
                            <span className="block text-sm font-semibold leading-tight text-slate-900">
                                Timetable
                            </span>
                        </span>
                    </a>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => void fetchTimetable()}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            title="Refresh timetable"
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

            <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
                <section className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-xl shadow-blue-200/60 lg:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100/90">Weekly schedule</p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight lg:text-3xl">Your class timetable</h1>
                    <p className="mt-2 text-sm text-blue-50">{dateLabel}</p>
                    {selectedDay === today && todayFromApi && !error && (
                        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
                            <FaCalendarAlt />
                            Today&apos;s classes loaded from API
                        </p>
                    )}
                </section>

                {error && (
                    <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Could not reach the server — showing cached schedule for today.{' '}
                        <button type="button" onClick={() => void fetchTimetable()} className="font-semibold underline">
                            Retry
                        </button>
                    </div>
                )}

                <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
                    {WEEKDAYS.map((day) => (
                        <button
                            key={day}
                            type="button"
                            onClick={() => setSelectedDay(day)}
                            className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                                selectedDay === day
                                    ? 'bg-gradient-to-r from-blue-700 to-sky-500 text-white shadow-md shadow-blue-200/60'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600'
                            }`}
                        >
                            {day.slice(0, 3)}
                            {day === today && (
                                <span className="ml-1.5 rounded-full bg-white/25 px-1.5 py-0.5 text-[10px]">Today</span>
                            )}
                        </button>
                    ))}
                </div>

                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">{selectedDay}</h2>
                            <p className="text-sm text-slate-500">
                                {sessions.length} session{sessions.length === 1 ? '' : 's'}
                            </p>
                        </div>
                        <FaCalendarAlt className="text-xl text-blue-600" />
                    </div>

                    {loading && selectedDay === today ? (
                        <div className="space-y-3">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5">
                                    <div className="h-4 w-1/2 rounded bg-slate-100" />
                                    <div className="mt-3 h-3 w-1/3 rounded bg-slate-100" />
                                </div>
                            ))}
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
                            <p className="text-sm text-slate-500">No classes scheduled for {selectedDay}.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sessions.map((session, index) => {
                                const { startTime, endTime } = parseTimeRange(session.time)
                                const isToday = selectedDay === today
                                return (
                                    <article
                                        key={`${session.course}-${index}`}
                                        className={`rounded-3xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                                            isToday
                                                ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white ring-1 ring-blue-100'
                                                : 'border-slate-200 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-base font-semibold text-slate-900">{session.course}</h3>
                                                {isToday && (
                                                    <span className="mt-1 inline-block rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                                        Today
                                                    </span>
                                                )}
                                            </div>
                                            <FaClock className="mt-1 shrink-0 text-slate-400" />
                                        </div>
                                        <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                                            <span className="flex items-center gap-2">
                                                <FaClock className="text-blue-600" />
                                                {startTime} – {endTime}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-blue-600" />
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
