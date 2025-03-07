'use client';

import React, { useEffect } from 'react';
import { WorkExperienceType } from '@/app/models/user';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { StepsBarComponentProps } from '@/app/components/StepsBar/StepsBar';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
	experienceForms: z.array(
		z.object({
			jobTitle: z.string().min(2, {
				message: 'Job title must be at least 2 characters.'
			}),
			company: z.string().min(2, {
				message: 'Company must be at least 2 characters.'
			}),
			startDate: z.date({
				required_error: 'Start date is required.'
			}),
			endDate: z.date(),
			location: z.string().min(2, {
				message: 'Location must be at least 2 characters.'
			}),
			description: z.string().min(2, {
				message: 'Description must be at least 2 characters.'
			})
		})
	)
});

export type ExperienceProps = StepsBarComponentProps;

export const Experience = ({ initialValues, onSuccess, onFieldChange }: ExperienceProps) => {
	const experienceForms = initialValues?.workExperience ?? ([] as unknown as WorkExperienceType[]);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			experienceForms
		}
	});

	const { control, handleSubmit, watch } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'experienceForms'
	});

	useEffect(() => {
		const subscription = watch(values => {
			onFieldChange?.('workExperience', values.experienceForms);
		});
		return () => subscription.unsubscribe();
	}, [watch, onFieldChange]);

	const onSubmit = () => {
		onSuccess?.();
	};

	return (
		<div>
			<div className="mb-4">
				<h3 className="pb-2">Tell us about the experience</h3>
				<p className="text-sm text-gray-500">Start with your last work experience</p>
			</div>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					{fields.map((field, index) => (
						<div key={field.id} className="relative">
							<div className="flex flex-col space-y-8">
								<div className="flex space-x-4">
									<FormField
										control={control}
										name={`experienceForms.${index}.jobTitle`}
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
										control={control}
										name={`experienceForms.${index}.company`}
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
										control={control}
										name={`experienceForms.${index}.startDate`}
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
										control={control}
										name={`experienceForms.${index}.endDate`}
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
										control={control}
										name={`experienceForms.${index}.location`}
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
									control={control}
									name={`experienceForms.${index}.description`}
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
							<span className="absolute top-[-20px] right-0 cursor-pointer" onClick={() => remove(index)}>
								<Trash color="red" />
							</span>
						</div>
					))}

					<Button
						className="mt-4 mb-4"
						onClick={() =>
							append({
								jobTitle: '',
								company: '',
								startDate: new Date(),
								endDate: new Date(),
								location: '',
								description: ''
							})
						}
					>
						Add Experience
					</Button>

					<div className="flex justify-end">
						<Button type="submit">Next Step</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
