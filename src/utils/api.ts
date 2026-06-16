const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export interface ApiTimetableEntry {
    course: string
    time: string
    hall: string
}

export interface ApiCourse {
    code: string
    name: string
    credits: number
}

export const api = {
    headers: () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('smart-campus-token') || ''}`,
    }),

    async get<T>(endpoint: string): Promise<T> {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: api.headers(),
        })
        if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
        return res.json() as Promise<T>
    },
}

export function parseTimeRange(time: string): { startTime: string; endTime: string } {
    const [startTime = '—', endTime = '—'] = time.split(/\s*-\s*/)
    return { startTime: startTime.trim(), endTime: endTime.trim() }
}
