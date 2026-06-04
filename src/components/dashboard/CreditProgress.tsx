interface CreditProgressProps {
	earned: number
	required: number
}

export default function CreditProgress({ earned, required }: CreditProgressProps) {
	const percentage = Math.min(100, Math.round((earned / required) * 100))

	return (
		<section
			style={{
				borderRadius: 20,
				border: '1px solid #dbe4f0',
				padding: 16,
				background: 'linear-gradient(135deg, #eff6ff, #ffffff)',
			}}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
				<div>
					<p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Completed Credits</p>
					<h3 style={{ margin: '4px 0 0' }}>{earned} / {required}</h3>
				</div>
				<strong style={{ color: '#2563eb' }}>{percentage}%</strong>
			</div>
			<div style={{ height: 10, borderRadius: 999, background: '#dbeafe', overflow: 'hidden' }}>
				<div style={{ width: `${percentage}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #2563eb, #38bdf8)' }} />
			</div>
		</section>
	)
}
