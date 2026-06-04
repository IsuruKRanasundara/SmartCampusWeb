import { useState } from 'react'
import type { Assignment } from '../../types/Assignment'

interface AssignmentFormProps {
	onSave: (assignment: Assignment) => void
}

export default function AssignmentForm({ onSave }: AssignmentFormProps) {
	const [title, setTitle] = useState('')
	const [subject, setSubject] = useState('')
	const [dueDate, setDueDate] = useState('')

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!title.trim() || !subject.trim() || !dueDate.trim()) {
			return
		}

		onSave({
			id: `${Date.now()}`,
			title: title.trim(),
			subject: subject.trim(),
			dueDate: dueDate.trim(),
			completed: false,
		})

		setTitle('')
		setSubject('')
		setDueDate('')
	}

	return (
		<form
			onSubmit={handleSubmit}
			style={{
				display: 'grid',
				gap: 8,
				padding: 12,
				borderRadius: 16,
				border: '1px solid #dbe4f0',
				background: '#f8fbff',
			}}
		>
			<input placeholder="Assignment title" value={title} onChange={(event) => setTitle(event.target.value)} />
			<input placeholder="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
			<input placeholder="Due date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
			<button type="submit">Add assignment</button>
		</form>
	)
}
