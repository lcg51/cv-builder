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

export const LockIconCustom: React.FC<IconProps> = ({
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

export const GoogleIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, color = 'currentColor' }) => (
	<svg className={className} width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
		/>
		<path
			fill="currentColor"
			d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
		/>
		<path
			fill="currentColor"
			d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
		/>
		<path
			fill="currentColor"
			d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
		/>
	</svg>
);
