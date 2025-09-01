'use client';

import React, { useEffect } from 'react';
import { SkillType } from '@/app/models/user';
import { Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { SkillsIcon, PlusIcon } from '@/components/icons/FormIcons';
import { type StepsBarComponentProps, useFormValidation } from '@/components/ui';

const formSchema = z.object({
	skillsForms: z.array(
		z.object({
			title: z.string().min(2, {
				message: 'Job title must be at least 2 characters.'
			}),
			level: z.array(
				z.number().min(2, {
					message: 'Company must be at least 2 characters.'
				})
			)
		})
	)
});

export type SkillsFormProps = StepsBarComponentProps;

export const SkillsForm = ({ initialValues, onFieldChange, formId }: SkillsFormProps) => {
	const skillsForms = initialValues?.skills ?? ([] as unknown as SkillType[]);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			skillsForms
		}
	});

	const { control, watch, trigger } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'skillsForms'
	});

	// Register form validation with StepsBar
	const { registerForm, unregisterForm } = useFormValidation();

	useEffect(() => {
		// Only register validation if formId is provided
		if (formId) {
			registerForm(formId, async () => {
				const isValid = await trigger();
				return isValid;
			});

			// Cleanup on unmount
			return () => {
				unregisterForm(formId);
			};
		}
	}, [formId, registerForm, unregisterForm, trigger]);

	useEffect(() => {
		const subscription = watch(values => onFieldChange?.('skills', values.skillsForms));
		return () => subscription.unsubscribe();
	}, [watch, onFieldChange]);

	return (
		<div>
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-3">
					<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
						<SkillsIcon color="black" />
					</div>
					<div>
						<h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
							Skills & Expertise
						</h3>
						<p className="text-slate-600 dark:text-slate-400">
							Add your key skills and rate your proficiency level for each
						</p>
					</div>
				</div>
			</div>
			<Form {...form}>
				<div className="space-y-6">
					{fields.map((field, index) => (
						<div
							key={field.id}
							className="relative bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
						>
							<div className="flex items-center justify-between mb-4">
								<h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
									Skill {index + 1}
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
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<FormField
										control={control}
										name={`skillsForms.${index}.title`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													Skill Name
												</FormLabel>
												<FormControl>
													<Input
														placeholder="JavaScript"
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
										name={`skillsForms.${index}.level`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													Proficiency Level ({field.value?.[0] || 50}%)
												</FormLabel>
												<FormControl>
													<div className="pt-2">
														<Slider
															value={field.value || [50]}
															onValueChange={field.onChange}
															max={100}
															min={0}
															step={5}
															className="w-full"
														/>
													</div>
												</FormControl>
												<div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
													<span>Beginner</span>
													<span>Intermediate</span>
													<span>Expert</span>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>
					))}

					<div className="flex justify-center">
						<button
							type="button"
							className="flex justify-center gap-2 px-6 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors duration-200"
							onClick={() =>
								append({
									title: '',
									level: [50]
								})
							}
						>
							<PlusIcon />
							Add Another Skill
						</button>
					</div>
				</div>
			</Form>
		</div>
	);
};
