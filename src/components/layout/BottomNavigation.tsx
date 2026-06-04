import type { ReactNode } from 'react'

interface NavigationItem {
	label: string
	icon: ReactNode
	active?: boolean
}

interface BottomNavigationProps {
	items: NavigationItem[]
}

export default function BottomNavigation({ items }: BottomNavigationProps) {
	return (
		<nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 bg-white/95 px-3 py-3 shadow-[0_-12px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:hidden">
			<div className="mx-auto grid max-w-7xl grid-cols-4 gap-2 sm:grid-cols-5">
				{items.map((item) => (
					<button
						key={item.label}
						type="button"
						className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-semibold transition duration-300 ${
							item.active ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
						}`}
						aria-current={item.active ? 'page' : undefined}
					>
						<span className="text-base">{item.icon}</span>
						<span>{item.label}</span>
					</button>
				))}
			</div>
		</nav>
	)
}
