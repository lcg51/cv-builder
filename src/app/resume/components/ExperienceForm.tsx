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
import { ExperienceIcon, PlusIcon, ArrowRightIcon } from '@/components/icons/FormIcons';

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

export type ExperienceFormProps = StepsBarComponentProps;

export const ExperienceForm = ({ initialValues, onSuccess, onFieldChange }: ExperienceFormProps) => {
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
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-3">
					<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
						<ExperienceIcon color="black" />
					</div>
					<div>
						<h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">Work Experience</h3>
						<p className="text-slate-600 dark:text-slate-400">
							Add your professional experience, starting with your most recent position
						</p>
					</div>
				</div>
			</div>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{fields.map((field, index) => (
						<div
							key={field.id}
							className="relative bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
						>
							<div className="flex items-center justify-between mb-4">
								<h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
									Experience {index + 1}
								</h4>
								<button
									type="button"
									className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
									onClick={() => remove(index)}
								>
									<Trash className="w-4 h-4" />
								</button>
							</div>
							<div className="flex flex-col space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={control}
										name={`experienceForms.${index}.jobTitle`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													Job Title
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Software Engineer"
														className="h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={control}
										name={`experienceForms.${index}.company`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													Company
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Google Inc."
														className="h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<FormField
										control={control}
										name={`experienceForms.${index}.startDate`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													Start Date
												</FormLabel>
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
											<FormItem>
												<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													End Date
												</FormLabel>
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
											<FormItem>
												<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													Location
												</FormLabel>
												<FormControl>
													<Input
														placeholder="San Francisco, CA"
														className="h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
														{...field}
													/>
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
											<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
												Job Description
											</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe your key responsibilities and achievements in this role..."
													className="min-h-24 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					))}

					<div className="flex justify-center">
						<button
							type="button"
							className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors duration-200"
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
							<PlusIcon />
							Add Another Experience
						</button>
					</div>

					<div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
						<div className="text-sm text-slate-500 dark:text-slate-400">Step 2 of 6</div>
						<Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-2 h-11">
							Continue
							<ArrowRightIcon className="w-4 h-4 ml-2" />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
