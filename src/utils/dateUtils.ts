/**
 * Shared date utility functions for Smart Campus Web Companion.
 */

/**
 * Format an ISO date string as a short human-readable date + time.
 * Example: "20 Jan, 09:00"
 */
export function formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

/**
 * Format an ISO date string as a date only.
 * Example: "20 Jan 2025"
 */
export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

/**
 * Format a time string as 12-hour with AM/PM.
 * Example: "09:00 AM"
 */
export function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

/**
 * Return a human-readable relative description of a due date.
 * Examples: "Overdue by 3d", "Due today", "Due tomorrow", "Due in 5 days"
 */
export function formatDueLabel(iso: string, completed = false): string {
    if (completed) return 'Submitted'
    const diff = new Date(iso).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return `Overdue by ${Math.abs(days)}d`
    if (days === 0) return 'Due today'
    if (days === 1) return 'Due tomorrow'
    return `Due in ${days} days`
}

/**
 * Return a relative time string (e.g. "3m ago", "2h ago", "1d ago").
 */
export function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60_000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
}

/**
 * Returns true if the date is in the past.
 */
export function isOverdue(iso: string): boolean {
    return new Date(iso).getTime() < Date.now()
}

/**
 * Returns true if the date falls within the next N days.
 */
export function isDueWithinDays(iso: string, days: number): boolean {
    const diff = new Date(iso).getTime() - Date.now()
    return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000
}

/**
 * Get current date as a readable label.
 * Example: "Monday, 20 January 2025"
 */
export function getTodayLabel(): string {
    return new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}
