'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { StepsBarComponentProps } from '@/app/components/StepsBar/StepsBar';
import { DatePicker } from '@/components/ui/date-picker';
import { EducationType } from '@/app/models/user';
import { Trash } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { EducationIcon, PlusIcon, ArrowRightIcon } from '@/components/icons/FormIcons';

const formSchema = z.object({
	educationForms: z.array(
		z.object({
			university: z.string().min(2, {
				message: 'School name must be at least 2 characters.'
			}),
			degree: z.string().min(2, {
				message: 'Degree must be at least 2 characters.'
			}),
			fieldOfStudy: z.string().min(2, {
				message: 'Field of study must be at least 2 characters.'
			}),
			finishDate: z.date({
				required_error: 'Start date is required.'
			}),
			city: z.string().min(2, {
				message: 'Field of study must be at least 2 characters.'
			}),
			description: z.string().min(2, {
				message: 'Description must be at least 2 characters.'
			})
		})
	)
});

export type EducationFormPropsType = StepsBarComponentProps;

export const EducationForm = ({ initialValues, onFieldChange, onSuccess }: EducationFormPropsType) => {
	const educationForms = initialValues?.education ?? ([] as unknown as EducationType[]);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			educationForms
		}
	});

	const { control, handleSubmit, watch } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'educationForms'
	});

	useEffect(() => {
		const subscription = watch(values => {
			onFieldChange?.('education', values.educationForms);
		});
		return () => subscription.unsubscribe();
	}, [watch, onFieldChange]);

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		onSuccess?.();
	}

	return (
		<div>
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-3">
					<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
						<EducationIcon color="black" />
					</div>
					<div>
						<h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">Education</h3>
						<p className="text-slate-600 dark:text-slate-400">
							Add your educational background, starting with your most recent qualification
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
									Education {index + 1}
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
										name={`educationForms.${index}.university`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													School/University
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Harvard University"
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
										name={`educationForms.${index}.degree`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													Degree
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Bachelor of Science"
														className="h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={control}
										name={`educationForms.${index}.finishDate`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													Graduation Date
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
										name={`educationForms.${index}.city`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													Location
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Cambridge, MA"
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
									name={`educationForms.${index}.description`}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
												Description (Optional)
											</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe relevant coursework, achievements, or activities..."
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
									degree: '',
									university: '',
									fieldOfStudy: '',
									finishDate: new Date(),
									city: '',
									description: ''
								})
							}
						>
							<PlusIcon />
							Add Another Education
						</button>
					</div>

					<div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
						<div className="text-sm text-slate-500 dark:text-slate-400">Step 3 of 6</div>
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
