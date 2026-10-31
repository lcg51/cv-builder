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

export interface DatePickerProps {
	onChange?: (date: Date) => void;
	value?: Date;
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(({ onChange, value }, ref) => {
	const locale = useLocale();
	const $t = useTranslations('common');
	const [date, setDate] = useState<Date | undefined>(value);

	useEffect(() => {
		setDate(value);
	}, [value]);

	const onSelect = (date?: Date) => {
		setDate(date);
		if (date) {
			onChange?.(date);
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
							'w-[280px] justify-start text-left font-normal',
							!date && 'text-muted-foreground'
						)}
					>
						<CalendarIcon />
						{formattedDate}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar mode="single" selected={date} onSelect={onSelect} initialFocus />
				</PopoverContent>
			</Popover>
		</div>
	);
});
DatePicker.displayName = 'DatePicker';
