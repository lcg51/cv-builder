'use client';

import { useEffect, useState, useMemo, forwardRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { CalendarIcon } from '@/ui/icons';

import { getDateLocale } from '@/lib/date-locale';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/components/button';
import { Calendar } from '@/ui/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/components/popover';

export interface MonthYearPickerProps {
	onChange?: (date: Date) => void;
	value?: Date;
}

export const MonthYearPicker = forwardRef<HTMLButtonElement, MonthYearPickerProps>(({ onChange, value }, ref) => {
	const locale = useLocale();
	const $t = useTranslations('common');
	const [date, setDate] = useState<Date | undefined>(value);

	useEffect(() => {
		setDate(value);
	}, [value]);

	const onSelect = (date?: Date) => {
		if (date) {
			// Set the date to the first day of the selected month
			const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
			setDate(firstDayOfMonth);
			onChange?.(firstDayOfMonth);
		}
	};

	const formattedDate = useMemo(
		() => (date ? format(date, 'MMM yyyy', { locale: getDateLocale(locale) }) : $t('pickDate')),
		[date, locale, $t]
	);

	return (
		<div className="flex">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						ref={ref}
						type="button"
						variant={'outline'}
						className={cn(
							'w-[280px] justify-start text-left font-normal h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary',
							!date && 'text-muted-foreground'
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{formattedDate}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={date}
						onSelect={onSelect}
						initialFocus
						showOutsideDays={false}
						disabled={date => date > new Date()}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
});
MonthYearPicker.displayName = 'MonthYearPicker';
