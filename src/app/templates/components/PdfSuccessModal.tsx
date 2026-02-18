import React from 'react';
import { CheckCircle } from '@/ui/icons';
import { Button } from '@/ui/components/button';
import { useTranslations } from 'next-intl';

type PdfSuccessModalProps = {
	onConfirm: () => void;
};

export function PdfSuccessModal({ onConfirm }: PdfSuccessModalProps) {
	const $t = useTranslations('PdfSuccessModal');

	return (
		<div className="flex flex-col items-center gap-4 py-4 text-center">
			<div className="w-16 h-16 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center">
				<CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
			</div>
			<h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{$t('title')}</h3>
			<p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">{$t('description')}</p>
			<Button variant="default" onClick={onConfirm} className="mt-2">
				{$t('button')}
			</Button>
		</div>
	);
}
