export type AssignmentStatus = 'Not Started' | 'In Progress' | 'Draft' | 'Review' | 'Submitted'
export type AssignmentPriority = 'high' | 'medium' | 'low'

export interface Assignment {
    id: string
    title: string
    subject: string
    course?: string
    dueDate: string
    status?: AssignmentStatus
    priority?: AssignmentPriority
    notes?: string
    completed: boolean
}
