import React from 'react';

export interface ChipButtonProps {
	label: string;
	onClick: () => void;
	icon?: React.ReactNode;
}

export const ChipButton: React.FC<ChipButtonProps> = ({ label, onClick, icon }) => (
	<button
		type="button"
		className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary hover:border-primary transition-colors duration-200"
		onClick={onClick}
	>
		{icon && icon}
		{label}
	</button>
);
