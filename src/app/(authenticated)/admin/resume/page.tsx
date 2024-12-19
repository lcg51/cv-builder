'use client';
import { useCallback } from 'react';
import { AddButton } from './components/AddButton/AddButton';
import { useRouter } from 'next/navigation';

export default function Resume() {
	const { push } = useRouter();
	const onClick = useCallback(() => {
		push('/admin/resume/create');
	}, []);

	return (
		<div className="flex flex-1 flex-col gap-4">
			Add New Resume
			<AddButton onClickCallback={onClick} />
		</div>
	);
}
