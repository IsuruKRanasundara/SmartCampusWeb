import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
    id: string
    name: string
    email: string
    studentId: string
    faculty: string
    year: string
    avatarUrl: string | null
    completedCredits: number
    totalCredits: number
}

interface UserContextValue {
    user: UserProfile | null
    isAuthenticated: boolean
    token: string | null
    login: (token: string, userData: Partial<UserProfile> & { email: string }) => void
    logout: () => void
    updateProfile: (updates: Partial<UserProfile>) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const UserContext = createContext<UserContextValue | null>(null)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadUserFromStorage(): UserProfile | null {
    try {
        const raw = localStorage.getItem('smart-campus-user-profile')
        if (!raw) return null
        return JSON.parse(raw) as UserProfile
    } catch {
        return null
    }
}

function saveUserToStorage(user: UserProfile): void {
    localStorage.setItem('smart-campus-user-profile', JSON.stringify(user))
}

function clearUserFromStorage(): void {
    localStorage.removeItem('smart-campus-user-profile')
    localStorage.removeItem('smart-campus-authenticated')
    localStorage.removeItem('smart-campus-user-email')
    localStorage.removeItem('smart-campus-token')
    localStorage.removeItem('token')
    localStorage.removeItem('data')
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(() => loadUserFromStorage())
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem('smart-campus-token') || localStorage.getItem('token')
    )

    const isAuthenticated = localStorage.getItem('smart-campus-authenticated') === 'true' && !!token

    // Sync user profile to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            saveUserToStorage(user)
        }
    }, [user])

    const login = useCallback(
        (newToken: string, userData: Partial<UserProfile> & { email: string }) => {
            const profile: UserProfile = {
                id: userData.id ?? String(Date.now()),
                name: userData.name ?? 'Student',
                email: userData.email,
                studentId: userData.studentId ?? '—',
                faculty: userData.faculty ?? 'Faculty of Computing',
                year: userData.year ?? '—',
                avatarUrl: userData.avatarUrl ?? null,
                completedCredits: userData.completedCredits ?? 0,
                totalCredits: userData.totalCredits ?? 120,
            }
            setToken(newToken)
            setUser(profile)
            localStorage.setItem('smart-campus-token', newToken)
            localStorage.setItem('token', newToken)
            localStorage.setItem('smart-campus-authenticated', 'true')
            localStorage.setItem('smart-campus-user-email', userData.email)
        },
        []
    )

    const logout = useCallback(() => {
        setUser(null)
        setToken(null)
        clearUserFromStorage()
        window.location.href = '/login'
    }, [])

    const updateProfile = useCallback((updates: Partial<UserProfile>) => {
        setUser((prev) => {
            if (!prev) return prev
            return { ...prev, ...updates }
        })
    }, [])

    return (
        <UserContext.Provider value={{ user, isAuthenticated, token, login, logout, updateProfile }}>
            {children}
        </UserContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUser(): UserContextValue {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error('useUser must be used inside <UserProvider>')
    return ctx
}
