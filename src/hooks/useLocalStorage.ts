import { useCallback, useEffect, useState } from 'react'

/**
 * A typed, event-synchronized localStorage hook.
 *
 * Usage:
 *   const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
 *
 * - Reads the initial value from localStorage, falling back to `defaultValue`.
 * - Writes to localStorage on every `setValue` call.
 * - Stays in sync across browser tabs via the native `storage` event.
 * - Provides a `removeValue` helper to clear the key.
 */
export function useLocalStorage<T>(
    key: string,
    defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item !== null ? (JSON.parse(item) as T) : defaultValue
        } catch {
            return defaultValue
        }
    })

    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                setStoredValue((prev) => {
                    const next = value instanceof Function ? value(prev) : value
                    window.localStorage.setItem(key, JSON.stringify(next))
                    return next
                })
            } catch (err) {
                console.error(`useLocalStorage: failed to set "${key}"`, err)
            }
        },
        [key]
    )

    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key)
            setStoredValue(defaultValue)
        } catch (err) {
            console.error(`useLocalStorage: failed to remove "${key}"`, err)
        }
    }, [key, defaultValue])

    // Sync with storage events from other tabs/windows
    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key !== key) return
            try {
                const next = e.newValue !== null ? (JSON.parse(e.newValue) as T) : defaultValue
                setStoredValue(next)
            } catch {
                setStoredValue(defaultValue)
            }
        }
        window.addEventListener('storage', handler)
        return () => window.removeEventListener('storage', handler)
    }, [key, defaultValue])

    return [storedValue, setValue, removeValue]
}

export default useLocalStorage
