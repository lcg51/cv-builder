'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { StepsBarComponentProps } from '@/app/components/StepsBar/StepsBar';
import { DatePicker } from '@/components/ui/date-picker';

const formSchema = z.object({
	schoolName: z.string().min(2, {
		message: 'School name must be at least 2 characters.'
	}),
	degree: z.string().min(2, {
		message: 'Degree must be at least 2 characters.'
	}),
	fieldOfStudy: z.string().min(2, {
		message: 'Field of study must be at least 2 characters.'
	}),
	startDate: z.date({
		required_error: 'Start date is required.'
	}),
	endDate: z.date()
});

export type EducationFormPropsType = StepsBarComponentProps;

export const EducationForm = ({ initialValues, onFieldChange, onSuccess }: EducationFormPropsType) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...initialValues?.education
		}
	});

	useEffect(() => {
		const subscription = form.watch(values => {
			Object.entries(values).forEach(([key, value]) => {
				onFieldChange?.(key, value);
			});
		});
		return () => subscription.unsubscribe();
	}, [form.watch, onFieldChange]);

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		onSuccess?.();
	}

	return (
		<Form {...form}>
			<div className="mb-4">
				<h3>Please enter your education info</h3>
			</div>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
					<FormField
						control={form.control}
						name="schoolName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>School name</FormLabel>
								<FormControl>
									<Input placeholder="School name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="degree"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Degree</FormLabel>
								<FormControl>
									<Input placeholder="Degree" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="fieldOfStudy"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Field of study</FormLabel>
								<FormControl>
									<Input placeholder="Field of study" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="startDate"
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
					<FormField
						control={form.control}
						name="endDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>End Date</FormLabel>
								<FormControl>
									<DatePicker {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-end">
					<Button type="submit">Next Step</Button>
				</div>
			</form>
		</Form>
	);
};
