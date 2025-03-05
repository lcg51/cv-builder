'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useEffect, forwardRef } from 'react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { WorkExperienceType } from '@/app/models/user';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
	jobTitle: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	company: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	startDate: z.date({
		required_error: 'A date of birth is required.'
	}),
	endDate: z.date(),
	location: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	description: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	})
});

export type ExperienceFormPropsType = {
	onFormChange?: (value: WorkExperienceType) => void;
	onSuccess?: () => void;
	experienceForm?: WorkExperienceType;
};

export const ExperienceForm = forwardRef<HTMLFormElement, ExperienceFormPropsType>(
	({ experienceForm, onFormChange, onSuccess }, ref) => {
		const form = useForm<z.infer<typeof formSchema>>({
			resolver: zodResolver(formSchema),
			defaultValues: (experienceForm as WorkExperienceType as z.infer<typeof formSchema>) || {
				jobTitle: '',
				company: '',
				startDate: new Date(),
				endDate: new Date(),
				location: '',
				description: ''
			}
		});

		useEffect(() => {
			const subscription = form.watch(values => {
				onFormChange?.(values as unknown as WorkExperienceType);
			});
			return () => subscription.unsubscribe();
		}, [form.watch, onFormChange, ref]);

		function onSubmit(values: z.infer<typeof formSchema>) {
			// Do something with the form values.
			// ✅ This will be type-safe and validated.
			console.log(values);
			onSuccess?.();
		}

		return (
			<div className="pb-4">
				<Form {...form}>
					<form ref={ref} className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-col space-y-8">
							<div className="flex space-x-4">
								<FormField
									control={form.control}
									name="jobTitle"
									render={({ field }) => (
										<FormItem className="w-1/2">
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
									name="company"
									render={({ field }) => (
										<FormItem className="w-1/2">
											<FormLabel>Employer</FormLabel>
											<FormControl>
												<Input placeholder="Employer" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex space-x-4">
								<FormField
									control={form.control}
									name="startDate"
									render={({ field }) => (
										<FormItem className="w-1/3">
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
										<FormItem className="w-1/3">
											<FormLabel>End Date</FormLabel>
											<FormControl>
												<DatePicker {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="location"
									render={({ field }) => (
										<FormItem className="w-1/3">
											<FormLabel>City</FormLabel>
											<FormControl>
												<Input placeholder="City" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</form>
				</Form>
			</div>
		);
	}
);
ExperienceForm.displayName = 'ExperienceForm';
