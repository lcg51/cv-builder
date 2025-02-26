'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
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
	onFieldChange?: (key: string, value: Array<WorkExperienceType>) => void;
	onSuccess?: () => void;
};
export const ExperienceForm = ({ onSuccess, onFieldChange }: ExperienceFormPropsType) => {
	const [showForm, setShowForm] = useState(false);
	const [experience, setExperience] = useState<Array<WorkExperienceType>>([]);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			jobTitle: '',
			company: '',
			startDate: new Date(),
			endDate: new Date(),
			location: '',
			description: ''
		}
	});

	const onAddNewExperience = useCallback(() => {
		setShowForm(true);
		const formValues = form.getValues();

		setExperience(prevValue => [...prevValue, formValues]);
	}, [form, experience, onFieldChange]);

	const updateExperience = useCallback(() => {
		const formValues = form.getValues();
		const updatedExperience = [formValues];
		setExperience(updatedExperience);
		onFieldChange?.('workExperience', updatedExperience);
	}, [experience]);

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		onSuccess?.();
	}

	return (
		<div>
			<h3 className="pb-8">Tell us about the experience</h3>
			<div className="pb-8">
				{showForm && (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="flex flex-col space-y-8">
								<div className="grow-[25vw]">
									<FormField
										control={form.control}
										name="jobTitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Job title</FormLabel>
												<FormControl>
													<Input
														placeholder="Job title"
														{...field}
														onChange={ev => {
															field.onChange(ev);
															updateExperience();
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="company"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Employer</FormLabel>
											<FormControl>
												<Input
													placeholder="Employer"
													{...field}
													onChange={ev => {
														field.onChange(ev);
														updateExperience();
													}}
												/>
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
												<DatePicker onChange={date => field.onChange(date)} />
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
												<DatePicker
													onChange={date => {
														field.onChange(date);
														console.log(date);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="location"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City</FormLabel>
											<FormControl>
												<Input
													placeholder="City"
													{...field}
													onChange={ev => {
														field.onChange(ev);
														updateExperience();
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													onChange={ev => {
														field.onChange(ev);
														updateExperience();
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</form>
					</Form>
				)}
				<Button className="pt-4" onClick={onAddNewExperience}>
					Add Experience
				</Button>
			</div>

			<Button type="submit">Next Step</Button>
		</div>
	);
};
