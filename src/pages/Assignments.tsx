import { useState } from 'react'
import AssignmentCard from '../components/assignments/AssignmentCard'
import AssignmentForm from '../components/assignments/AssignmentForm'
import type { Assignment } from '../types/Assignment'

export default function Assignments() {
  const [items, setItems] = useState<Assignment[]>([])

  return (
    <main style={{ padding: 12 }}>
      <h2>Assignments</h2>
      <AssignmentForm onSave={(assignment) => setItems((current) => [assignment, ...current])} />
      <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
        {items.map((it) => (
          <AssignmentCard key={it.id} assignment={it} />
        ))}
      </div>
    </main>
  )
}

