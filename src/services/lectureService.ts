import { api } from '../utils/api'
import type { ApiTimetableEntry } from '../utils/api'
import { FALLBACK_WEEKLY_TIMETABLE, getCurrentWeekday } from '../data/weeklyTimetable'
import type { Weekday } from '../data/weeklyTimetable'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LectureSession {
    id: string
    course: string
    startTime: string
    endTime: string
    hall: string
    building: string
    isNext: boolean
    isNow: boolean
}

export interface WeeklyTimetable {
    [day: string]: LectureSession[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseTimeRange(time: string): { startTime: string; endTime: string } {
    const [startTime = '—', endTime = '—'] = time.split(/\s*-\s*/)
    return { startTime: startTime.trim(), endTime: endTime.trim() }
}

function timeToMinutes(time: string): number {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
    if (!match) return 0
    let hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    const period = match[3]?.toUpperCase()
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return hours * 60 + minutes
}

function mapEntriesToSessions(entries: ApiTimetableEntry[]): LectureSession[] {
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()

    // Find the next upcoming session
    let nextIdx = -1
    let nextStart = Infinity
    entries.forEach((entry, i) => {
        const { startTime } = parseTimeRange(entry.time)
        const mins = timeToMinutes(startTime)
        if (mins >= nowMinutes && mins < nextStart) {
            nextStart = mins
            nextIdx = i
        }
    })
    if (nextIdx < 0 && entries.length > 0) nextIdx = 0

    return entries.map((entry, i) => {
        const { startTime, endTime } = parseTimeRange(entry.time)
        const startMins = timeToMinutes(startTime)
        const endMins = timeToMinutes(endTime)
        return {
            id: `${entry.course}-${i}`,
            course: entry.course,
            startTime,
            endTime,
            hall: entry.hall,
            building: entry.hall,
            isNext: i === nextIdx,
            isNow: nowMinutes >= startMins && nowMinutes < endMins,
        }
    })
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Fetch today's timetable from the API.
 * Falls back to the local static fallback on any error.
 */
export async function fetchTodayLectures(): Promise<LectureSession[]> {
    try {
        const entries = await api.get<ApiTimetableEntry[]>('/api/timetable/today')
        return mapEntriesToSessions(entries)
    } catch {
        const today = getCurrentWeekday()
        const fallback = FALLBACK_WEEKLY_TIMETABLE[today] ?? []
        return mapEntriesToSessions(fallback)
    }
}

/**
 * Fetch timetable for a specific weekday.
 * Only the current day has an API endpoint; other days use static data.
 */
export async function fetchDayLectures(day: Weekday): Promise<LectureSession[]> {
    const today = getCurrentWeekday()
    if (day === today) {
        return fetchTodayLectures()
    }
    const entries = FALLBACK_WEEKLY_TIMETABLE[day] ?? []
    return mapEntriesToSessions(entries)
}

/**
 * Get the next upcoming lecture from a list of sessions.
 */
export function getNextLecture(sessions: LectureSession[]): LectureSession | undefined {
    return sessions.find((s) => s.isNext)
}

/**
 * Get the currently-in-progress lecture, if any.
 */
export function getCurrentLecture(sessions: LectureSession[]): LectureSession | undefined {
    return sessions.find((s) => s.isNow)
}
