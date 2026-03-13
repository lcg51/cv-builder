'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Textarea } from '@/ui/components/textarea';
import { Sparkles, Loader2 } from '@/ui/icons';
import { useAISuggest, type AISuggestContext } from '@/hooks/useAISuggest';
import { AISuggestType } from '@/lib/dynamicFormSchema';

interface AITextareaProps extends React.ComponentProps<typeof Textarea> {
	aiAssist: {
		type: AISuggestType;
		getContext?: () => AISuggestContext;
	};
	onAISuggestion: (text: string) => void;
}

export const AITextarea: React.FC<AITextareaProps> = ({ aiAssist, onAISuggestion, ...props }) => {
	const t = useTranslations('AIAssist');
	const { suggest, isLoading, error } = useAISuggest(t('error'));

	const handleClick = async () => {
		const currentText = typeof props.value === 'string' ? props.value : '';
		const result = await suggest(aiAssist.type, currentText, aiAssist.getContext?.());
		if (result) {
			onAISuggestion(result);
		}
	};

	const isEmpty = !props.value || props.value === '';

	return (
		<div>
			<Textarea {...props} />
			<div className="flex items-center justify-end mt-1.5 gap-2">
				{error && <span className="text-xs text-red-500">{error}</span>}
				<button
					type="button"
					onClick={handleClick}
					disabled={isLoading || isEmpty}
					className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoading ? (
						<Loader2 className="w-3.5 h-3.5 animate-spin" />
					) : (
						<Sparkles className="w-3.5 h-3.5" />
					)}
					{isLoading ? t('loading') : t('button')}
				</button>
			</div>
		</div>
	);
};
