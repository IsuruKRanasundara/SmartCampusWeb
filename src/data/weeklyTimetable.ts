import type { ApiTimetableEntry } from '../utils/api'

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const
export type Weekday = (typeof WEEKDAYS)[number]

export const FALLBACK_WEEKLY_TIMETABLE: Record<Weekday, ApiTimetableEntry[]> = {
    Monday: [
        { course: 'Mobile Web Development', time: '08:00 AM - 10:00 AM', hall: 'Lab 01' },
        { course: 'Distributed Systems', time: '11:00 AM - 01:00 PM', hall: 'A101' },
    ],
    Tuesday: [
        { course: 'Database Systems', time: '09:00 AM - 11:00 AM', hall: 'Lecture Hall 3' },
        { course: 'Software Engineering', time: '01:00 PM - 03:00 PM', hall: 'Room 204' },
    ],
    Wednesday: [
        { course: 'Mobile Web Development', time: '08:00 AM - 10:00 AM', hall: 'Lab 02' },
        { course: 'Human Computer Interaction', time: '02:00 PM - 04:00 PM', hall: 'Design Studio 1' },
    ],
    Thursday: [
        { course: 'Distributed Systems', time: '10:00 AM - 12:00 PM', hall: 'A101' },
        { course: 'Network Security', time: '02:00 PM - 04:00 PM', hall: 'Lab 05' },
    ],
    Friday: [
        { course: 'Database Systems', time: '09:00 AM - 11:00 AM', hall: 'Lecture Hall 3' },
        { course: 'Career Skills Workshop', time: '01:00 PM - 02:30 PM', hall: 'Seminar Room B' },
    ],
}

export function getCurrentWeekday(): Weekday {
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as Weekday
    return WEEKDAYS.includes(day) ? day : 'Monday'
}
