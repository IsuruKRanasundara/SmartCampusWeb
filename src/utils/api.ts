export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smart-campus-web-api.vercel.app'

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

/**
 * Retries a fetch request with exponential backoff.
 * Critical for Vercel cold starts — the server may need 2-3 attempts to wake up.
 *
 * @param fn        - Async function that performs the actual fetch
 * @param retries   - Max number of attempts (default 3)
 * @param baseDelay - Initial delay in ms, doubles each attempt (default 1200ms)
 */
export async function fetchWithRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    baseDelay = 1200
): Promise<T> {
    let lastError: unknown
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await fn()
        } catch (err) {
            lastError = err
            if (attempt < retries - 1) {
                // Exponential backoff: 1200ms → 2400ms → 4800ms
                await new Promise(res => setTimeout(res, baseDelay * 2 ** attempt))
            }
        }
    }
    throw lastError
}

export const api = {
    headers: () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('smart-campus-token') || ''}`,
    }),

    /** GET with automatic Vercel cold-start retry */
    async get<T>(endpoint: string): Promise<T> {
        return fetchWithRetry(async () => {
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: api.headers(),
            })
            if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
            return res.json() as Promise<T>
        })
    },

    /** POST with automatic Vercel cold-start retry */
    async post<T>(endpoint: string, body: unknown): Promise<T> {
        return fetchWithRetry(async () => {
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: api.headers(),
                body: JSON.stringify(body),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error((data as { message?: string }).message || `API error ${res.status}`)
            }
            return res.json() as Promise<T>
        })
    },
}

export function parseTimeRange(time: string): { startTime: string; endTime: string } {
    const [startTime = '—', endTime = '—'] = time.split(/\s*-\s*/)
    return { startTime: startTime.trim(), endTime: endTime.trim() }
}