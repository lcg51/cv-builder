'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useEffect } from 'react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ContactIcon } from '@/components/icons/FormIcons';
import { type StepsBarComponentProps, useFormValidation } from '@/components/ui';

const formSchema = z.object({
	firstName: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	lastName: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	email: z
		.string()
		.min(2, {
			message: 'Username must be at least 2 characters.'
		})
		.email({
			message: 'Invalid email address.'
		}),
	phone: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	city: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	postalCode: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	})
});

export type ContactFormPropsType = StepsBarComponentProps;

export const ContactForm = ({ initialValues, onFieldChange, formId }: ContactFormPropsType) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...initialValues
		}
	});

	// Register form validation with StepsBar
	const { registerForm, unregisterForm } = useFormValidation();

	useEffect(() => {
		// Only register validation if formId is provided
		if (formId) {
			registerForm(formId, async () => {
				const isValid = await form.trigger();
				return isValid;
			});

			// Cleanup on unmount
			return () => {
				unregisterForm(formId);
			};
		}
	}, [formId, registerForm, unregisterForm, form]);

	useEffect(() => {
		const subscription = form.watch(values => {
			Object.entries(values).forEach(([key, value]) => {
				onFieldChange?.(key, value);
			});
		});
		return () => subscription.unsubscribe();
	}, [form.watch, onFieldChange]);

	return (
		<>
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-3">
					<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
						<ContactIcon color="black" />
					</div>
					<div>
						<h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
							Contact Information
						</h3>
						<p className="text-slate-600 dark:text-slate-400">
							Tell us about yourself and how to reach you
						</p>
					</div>
				</div>
			</div>
			<Form {...form}>
				<div className="space-y-6">
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
										First Name
									</FormLabel>
									<FormControl>
										<Input
											placeholder="John"
											className="h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
										Last Name
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Doe"
											className="h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
										Email Address
									</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="john.doe@example.com"
											className="h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
										Phone Number
									</FormLabel>
									<FormControl>
										<Input
											type="tel"
											placeholder="+1 (555) 123-4567"
											className="h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="city"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
										City
									</FormLabel>
									<FormControl>
										<Input
											placeholder="New York"
											className="h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="postalCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
										Postal Code
									</FormLabel>
									<FormControl>
										<Input
											placeholder="10001"
											className="h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			</Form>
		</>
	);
};
