'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';

const formSchema = z.object({
	jobtitle: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	employer: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	startDate: z.date({
		required_error: 'A date of birth is required.'
	}),
	endDate: z.date(),
	city: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	description: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	})
});

export type ExperienceFormPropsType = {
	onFieldChange?: (key: string, value: string) => void;
	onSuccess?: () => void;
};

export const ExperienceForm = ({ onSuccess }: ExperienceFormPropsType) => {
	const [showForm, setShowForm] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			jobtitle: '',
			employer: '',
			city: '',
			description: ''
		}
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		onSuccess?.();
	}

	return (
		<div>
			<h3>Tell us about the experience</h3>
			{showForm && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
							<FormField
								control={form.control}
								name="jobtitle"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Job title</FormLabel>
										<FormControl>
											<Input placeholder="Job title" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="employer"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Employer</FormLabel>
										<FormControl>
											<Input placeholder="Employer" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="employer"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start Date</FormLabel>
										<FormControl>
											<DatePicker {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit">Next Step</Button>
					</form>
				</Form>
			)}
			<Button onClick={() => setShowForm(true)}>Add Experience</Button>
		</div>
	);
};
