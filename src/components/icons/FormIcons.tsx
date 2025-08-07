import React from 'react';

export interface IconProps {
	className?: string;
	size?: number;
	color?: string;
	darkMode?: boolean;
}

export const ContactIcon: React.FC<IconProps> = ({
	className = 'w-5 h-5 dark:bg-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
		/>
	</svg>
);

export const ExperienceIcon: React.FC<IconProps> = ({
	className = 'w-5 h-5 dark:bg-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6.341"
		/>
	</svg>
);

export const EducationIcon: React.FC<IconProps> = ({
	className = 'w-5 h-5 dark:bg-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
		/>
	</svg>
);

export const SkillsIcon: React.FC<IconProps> = ({
	className = 'w-5 h-5 dark:bg-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
		/>
	</svg>
);

export const AboutIcon: React.FC<IconProps> = ({
	className = 'w-5 h-5 dark:bg-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</svg>
);

export const EyeIcon: React.FC<IconProps> = ({
	className = 'w-5 h-5 dark:bg-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
		/>
	</svg>
);

export const PlusIcon: React.FC<IconProps> = ({
	className = 'w-5 h-5 dark:text-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
	</svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({
	className = 'w-4 h-4 dark:text-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
	</svg>
);

export const DownloadIcon: React.FC<IconProps> = ({
	className = 'w-4 h-4 dark:text-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</svg>
);

export const LockIcon: React.FC<IconProps> = ({
	className = 'w-4 h-4 dark:text-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
		/>
	</svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({
	className = 'w-5 h-5 dark:text-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
	</svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({
	className = 'w-5 h-5 dark:text-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
	</svg>
);

export const CheckIcon: React.FC<IconProps> = ({
	className = 'w-5 h-5 dark:text-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
	</svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({
	className = 'w-5 h-5 dark:text-slate-400',
	size,
	color = 'currentColor'
}) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);
