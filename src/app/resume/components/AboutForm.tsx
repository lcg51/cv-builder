'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StepsBarComponentProps } from '@/app/components/StepsBar/StepsBar';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
	aboutMe: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	})
});

export type ContactFormPropsType = StepsBarComponentProps;

export const AboutForm = ({ initialValues, onFieldChange, onSuccess }: ContactFormPropsType) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...initialValues
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

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
		onSuccess?.();
	}
	return (
		<Form {...form}>
			<div className="mb-4">
				<h3 className="pb-2">Write down your professional summary</h3>
				<p className="text-sm text-gray-500">Include up to 3 sentences that describe your general experience</p>
			</div>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
					<FormField
						control={form.control}
						name="aboutMe"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Summary</FormLabel>
								<FormControl>
									<Textarea {...field} />
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
