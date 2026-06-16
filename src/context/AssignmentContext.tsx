import { createContext, useCallback, useContext, useEffect, useReducer } from 'react'
import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AssignmentStatus = 'Not Started' | 'In Progress' | 'Draft' | 'Review' | 'Submitted'
export type AssignmentPriority = 'high' | 'medium' | 'low'

export interface Assignment {
    id: string
    title: string
    subject: string
    course: string
    dueDate: string
    status: AssignmentStatus
    priority: AssignmentPriority
    notes: string
    completed: boolean
    createdAt: string
    updatedAt: string
}

interface AssignmentState {
    items: Assignment[]
    loading: boolean
    error: string | null
}

type AssignmentAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_ITEMS'; payload: Assignment[] }
    | { type: 'ADD_ITEM'; payload: Assignment }
    | { type: 'UPDATE_ITEM'; payload: Assignment }
    | { type: 'DELETE_ITEM'; payload: string }
    | { type: 'TOGGLE_COMPLETE'; payload: string }

interface AssignmentContextValue {
    state: AssignmentState
    addAssignment: (data: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateAssignment: (id: string, updates: Partial<Assignment>) => void
    deleteAssignment: (id: string) => void
    toggleComplete: (id: string) => void
    getByStatus: (status: AssignmentStatus) => Assignment[]
    getDueThisWeek: () => Assignment[]
    getOverdue: () => Assignment[]
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'smart-campus-assignments'

function loadFromStorage(): Assignment[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return DEMO_ASSIGNMENTS
        const parsed = JSON.parse(raw) as Assignment[]
        return parsed.length > 0 ? parsed : DEMO_ASSIGNMENTS
    } catch {
        return DEMO_ASSIGNMENTS
    }
}

function saveToStorage(items: Assignment[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const now = new Date()
function daysFromNow(d: number): string {
    const dt = new Date(now)
    dt.setDate(dt.getDate() + d)
    return dt.toISOString()
}

const DEMO_ASSIGNMENTS: Assignment[] = [
    {
        id: 'demo-1',
        title: 'Mobile UI Prototype',
        subject: 'Human Computer Interaction',
        course: 'HCI',
        dueDate: daysFromNow(2),
        status: 'In Progress',
        priority: 'high',
        notes: 'Figma wireframes + click-through demo required.',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'demo-2',
        title: 'Database ER Diagram & Report',
        subject: 'Database Systems',
        course: 'DBS',
        dueDate: daysFromNow(5),
        status: 'Draft',
        priority: 'medium',
        notes: '3NF normalization + SQL schema submission.',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'demo-3',
        title: 'Network Security Lab Report',
        subject: 'Network Security',
        course: 'NET',
        dueDate: daysFromNow(8),
        status: 'Not Started',
        priority: 'medium',
        notes: 'Wireshark packet analysis exercise.',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'demo-4',
        title: 'Distributed Systems Research Paper',
        subject: 'Distributed Systems',
        course: 'DS',
        dueDate: daysFromNow(14),
        status: 'Not Started',
        priority: 'low',
        notes: 'Compare CAP theorem trade-offs in 3 real-world systems.',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'demo-5',
        title: 'Software Engineering Case Study',
        subject: 'Software Engineering',
        course: 'SE',
        dueDate: daysFromNow(-3),
        status: 'Submitted',
        priority: 'low',
        notes: 'Agile sprint retrospective analysis.',
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
]

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: AssignmentState, action: AssignmentAction): AssignmentState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_ERROR':
            return { ...state, error: action.payload }
        case 'SET_ITEMS':
            return { ...state, items: action.payload, loading: false }
        case 'ADD_ITEM':
            return { ...state, items: [action.payload, ...state.items] }
        case 'UPDATE_ITEM':
            return {
                ...state,
                items: state.items.map((i) => (i.id === action.payload.id ? action.payload : i)),
            }
        case 'DELETE_ITEM':
            return { ...state, items: state.items.filter((i) => i.id !== action.payload) }
        case 'TOGGLE_COMPLETE':
            return {
                ...state,
                items: state.items.map((i) =>
                    i.id === action.payload
                        ? {
                            ...i,
                            completed: !i.completed,
                            status: !i.completed ? 'Submitted' : 'In Progress',
                            updatedAt: new Date().toISOString(),
                        }
                        : i
                ),
            }
        default:
            return state
    }
}

// ─── Context + Provider ───────────────────────────────────────────────────────

const AssignmentContext = createContext<AssignmentContextValue | null>(null)

export function AssignmentProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        items: loadFromStorage(),
        loading: false,
        error: null,
    })

    // Persist to localStorage on every change
    useEffect(() => {
        saveToStorage(state.items)
    }, [state.items])

    const addAssignment = useCallback(
        (data: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>) => {
            const assignment: Assignment = {
                ...data,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
            dispatch({ type: 'ADD_ITEM', payload: assignment })
        },
        []
    )

    const updateAssignment = useCallback((id: string, updates: Partial<Assignment>) => {
        const existing = state.items.find((i) => i.id === id)
        if (!existing) return
        dispatch({
            type: 'UPDATE_ITEM',
            payload: { ...existing, ...updates, updatedAt: new Date().toISOString() },
        })
    }, [state.items])

    const deleteAssignment = useCallback((id: string) => {
        dispatch({ type: 'DELETE_ITEM', payload: id })
    }, [])

    const toggleComplete = useCallback((id: string) => {
        dispatch({ type: 'TOGGLE_COMPLETE', payload: id })
    }, [])

    const getByStatus = useCallback(
        (status: AssignmentStatus) => state.items.filter((i) => i.status === status),
        [state.items]
    )

    const getDueThisWeek = useCallback(() => {
        const weekMs = 7 * 24 * 60 * 60 * 1000
        const nowMs = Date.now()
        return state.items.filter((i) => {
            const due = new Date(i.dueDate).getTime()
            return !i.completed && due >= nowMs && due - nowMs <= weekMs
        })
    }, [state.items])

    const getOverdue = useCallback(() => {
        const nowMs = Date.now()
        return state.items.filter(
            (i) => !i.completed && new Date(i.dueDate).getTime() < nowMs
        )
    }, [state.items])

    return (
        <AssignmentContext.Provider
            value={{
                state,
                addAssignment,
                updateAssignment,
                deleteAssignment,
                toggleComplete,
                getByStatus,
                getDueThisWeek,
                getOverdue,
            }}
        >
            {children}
        </AssignmentContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAssignments(): AssignmentContextValue {
    const ctx = useContext(AssignmentContext)
    if (!ctx) throw new Error('useAssignments must be used inside <AssignmentProvider>')
    return ctx
}
