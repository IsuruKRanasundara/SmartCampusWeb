import type { Lecture } from '../../types/Lecture'

interface LectureCardProps {
	lecture: Lecture
}

export default function LectureCard({ lecture }: LectureCardProps) {
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
			<h3 style={{ margin: 0 }}>{lecture.subject}</h3>
			<p style={{ margin: '4px 0 0', color: '#64748b' }}>{lecture.lecturer}</p>
			<p style={{ margin: '10px 0 0', color: '#475569', fontSize: 14 }}>{lecture.time}</p>
			<p style={{ margin: '4px 0 0', color: '#475569', fontSize: 14 }}>{lecture.location}</p>
		</article>
	)
}
