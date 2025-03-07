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
			<div className="mb-4">
				<h3 className="pb-2">Enter your education information</h3>
				<p className="text-sm text-gray-500">Enter your last education first</p>
			</div>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					{fields.map((field, index) => (
						<div key={field.id} className="relative">
							<div className="flex flex-col space-y-8">
								<div className="flex space-x-4">
									<FormField
										control={control}
										name={`educationForms.${index}.university`}
										render={({ field }) => (
											<FormItem className="w-1/2">
												<FormLabel>School</FormLabel>
												<FormControl>
													<Input placeholder="School" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={control}
										name={`educationForms.${index}.degree`}
										render={({ field }) => (
											<FormItem className="w-1/2">
												<FormLabel>Degree</FormLabel>
												<FormControl>
													<Input placeholder="Degree" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="flex space-x-4">
									<FormField
										control={control}
										name={`educationForms.${index}.finishDate`}
										render={({ field }) => (
											<FormItem className="w-1/3">
												<FormLabel>Graduation Date</FormLabel>
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
									name={`educationForms.${index}.description`}
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
								degree: '',
								university: '',
								fieldOfStudy: '',
								finishDate: new Date(),
								city: '',
								description: ''
							})
						}
					>
						Add Education
					</Button>

					<div className="flex justify-end">
						<Button type="submit">Next Step</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
