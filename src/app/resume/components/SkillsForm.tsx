'use client';

import React, { useEffect } from 'react';
import { SkillType } from '@/app/models/user';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { StepsBarComponentProps } from '@/app/components/StepsBar/StepsBar';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

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

export const SkillsForm = ({ initialValues, onSuccess, onFieldChange }: SkillsFormProps) => {
	const skillsForms = initialValues?.skills ?? ([] as unknown as SkillType[]);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			skillsForms
		}
	});

	const { control, handleSubmit, watch } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'skillsForms'
	});

	useEffect(() => {
		const subscription = watch(values => onFieldChange?.('skills', values.skillsForms));
		return () => subscription.unsubscribe();
	}, [watch, onFieldChange]);

	const onSubmit = () => {
		onSuccess?.();
	};

	return (
		<div>
			<div className="mb-4">
				<h3 className="pb-2">Tell us about you skills</h3>
				<p className="text-sm text-gray-500">Start with one you are most experienced at.</p>
			</div>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					{fields.map((field, index) => (
						<div key={field.id} className="relative">
							<div className="flex flex-col space-y-8">
								<div className="flex space-x-4">
									<FormField
										control={control}
										name={`skillsForms.${index}.title`}
										render={({ field }) => (
											<FormItem className="w-1/2">
												<FormLabel>Skill</FormLabel>
												<FormControl>
													<Input placeholder="Skill" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={control}
										name={`skillsForms.${index}.level`}
										render={({ field }) => (
											<FormItem className="w-1/2">
												<FormLabel>Level</FormLabel>
												<FormControl>
													<Slider
														defaultValue={field.value}
														onValueChange={e => field.onChange(e)}
														max={100}
														step={1}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
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
								title: '',
								level: [50]
							})
						}
					>
						Add Skill
					</Button>

					<div className="flex justify-end">
						<Button type="submit">Next Step</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
