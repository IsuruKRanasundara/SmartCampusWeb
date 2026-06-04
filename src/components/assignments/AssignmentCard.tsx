import type { Assignment } from '../../types/Assignment'

interface AssignmentCardProps {
	assignment: Assignment
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
	return (
		<article
			style={{
				borderRadius: 16,
				border: '1px solid #dbe4f0',
				padding: 12,
				background: '#fff',
				boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)',
			}}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
				<div>
					<h3 style={{ margin: 0 }}>{assignment.title}</h3>
					<p style={{ margin: '4px 0 0', color: '#64748b' }}>{assignment.subject}</p>
				</div>
				<span
					style={{
						alignSelf: 'start',
						borderRadius: 999,
						padding: '4px 10px',
						background: assignment.completed ? '#ecfdf5' : '#eff6ff',
						color: assignment.completed ? '#047857' : '#1d4ed8',
						fontSize: 12,
						fontWeight: 700,
					}}
				>
					{assignment.completed ? 'Completed' : 'Pending'}
				</span>
			</div>
			<p style={{ margin: '10px 0 0', color: '#475569', fontSize: 14 }}>Due {assignment.dueDate}</p>
		</article>
	)
}

