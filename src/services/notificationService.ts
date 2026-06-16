import { api } from '../utils/api'

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType = 'info' | 'assignment' | 'grade' | 'system'

export interface AppNotification {
    id: string | number
    message: string
    type: NotificationType
    time: string
    read: boolean
    link?: string
}

interface ApiNotification {
    id: number
    message: string
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const READ_KEY = 'smart-campus-read-notifications'

function getReadIds(): Set<string> {
    try {
        const raw = localStorage.getItem(READ_KEY)
        return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
    } catch {
        return new Set()
    }
}

function saveReadIds(ids: Set<string>): void {
    localStorage.setItem(READ_KEY, JSON.stringify([...ids]))
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inferType(message: string): NotificationType {
    const lower = message.toLowerCase()
    if (lower.includes('assignment') || lower.includes('deadline') || lower.includes('submit')) return 'assignment'
    if (lower.includes('grade') || lower.includes('result') || lower.includes('quiz') || lower.includes('exam')) return 'grade'
    if (lower.includes('system') || lower.includes('maintenance') || lower.includes('update')) return 'system'
    return 'info'
}

function formatTimeAgo(dateStr?: string): string {
    if (!dateStr) return 'Recently'
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
}

// ─── Static fallback data ─────────────────────────────────────────────────────

export const FALLBACK_NOTIFICATIONS: AppNotification[] = [
    {
        id: 1,
        message: 'ASE lecture moved to Room 301 tomorrow — check your timetable.',
        type: 'info',
        time: '10m ago',
        read: false,
    },
    {
        id: 2,
        message: 'New assignment posted: Cloud Architecture Design — due in 5 days.',
        type: 'assignment',
        time: '1h ago',
        read: false,
    },
    {
        id: 3,
        message: 'Your Database Systems Report was graded: B+',
        type: 'grade',
        time: '3h ago',
        read: true,
    },
    {
        id: 4,
        message: 'Semester exam timetable is now available on the student portal.',
        type: 'info',
        time: '1d ago',
        read: true,
    },
    {
        id: 5,
        message: 'HCI assignment deadline extended by 48 hours.',
        type: 'assignment',
        time: '2d ago',
        read: true,
    },
]

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Fetch notifications from the API, marking previously-read ones correctly.
 * Falls back to static demo data if the API is unreachable.
 */
export async function fetchNotifications(): Promise<AppNotification[]> {
    const readIds = getReadIds()

    try {
        const data = await api.get<ApiNotification[]>('/api/notifications')
        return data.map((n) => ({
            id: n.id,
            message: n.message,
            type: inferType(n.message),
            time: formatTimeAgo(),
            read: readIds.has(String(n.id)),
        }))
    } catch {
        return FALLBACK_NOTIFICATIONS.map((n) => ({
            ...n,
            read: readIds.has(String(n.id)) || n.read,
        }))
    }
}

/**
 * Mark one notification as read. Persists to localStorage.
 */
export function markAsRead(id: string | number): void {
    const ids = getReadIds()
    ids.add(String(id))
    saveReadIds(ids)
}

/**
 * Mark all notifications as read.
 */
export function markAllAsRead(notifications: AppNotification[]): void {
    const ids = getReadIds()
    notifications.forEach((n) => ids.add(String(n.id)))
    saveReadIds(ids)
}

/**
 * Clear all read-state from storage (useful for testing).
 */
export function clearReadState(): void {
    localStorage.removeItem(READ_KEY)
}

/**
 * Set up a polling interval to refresh notifications.
 * Returns a cleanup function.
 */
export function startNotificationPolling(
    onUpdate: (notifications: AppNotification[]) => void,
    intervalMs = 60_000
): () => void {
    const tick = async () => {
        const data = await fetchNotifications()
        onUpdate(data)
    }

    void tick()
    const id = setInterval(() => void tick(), intervalMs)
    return () => clearInterval(id)
}
