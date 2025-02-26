'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface DatePickerProps {
	onChange?: (date: Date) => void;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(({ onChange, ...props }, ref) => {
	const [date, setDate] = React.useState<Date>();

	const onSelect = (date?: Date) => {
		setDate(date);
		date && onChange?.(date);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className="flex">
					<Button
						variant={'outline'}
						className={cn(
							'w-[280px] justify-start text-left font-normal',
							!date && 'text-muted-foreground'
						)}
					>
						<CalendarIcon />
						{date ? format(date, 'PPP') : <span>Pick a date</span>}
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
