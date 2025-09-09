'use client';

import { useEffect, useState, useMemo, forwardRef } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from '@/ui/icons';

import { cn } from '@/lib/utils';
import { Button } from '@/ui/components/button';
import { Calendar } from '@/ui/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/components/popover';

export interface DatePickerProps {
	onChange?: (date: Date) => void;
	value?: Date;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({ onChange, value }, ref) => {
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
		() => (date ? `${format(date, 'MMM')} ${format(date, 'yyyy')}` : 'Pick a date'),
		[date]
	);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className="flex" ref={ref}>
					<Button
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
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar mode="single" selected={date} onSelect={onSelect} initialFocus />
			</PopoverContent>
		</Popover>
	);
});
DatePicker.displayName = 'DatePicker';
