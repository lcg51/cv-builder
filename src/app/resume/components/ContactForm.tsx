'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { StepsBarComponentProps } from '@/app/components/StepsBar/StepsBar';

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

export const ContactForm = ({ initialValues, onFieldChange, onSuccess }: ContactFormPropsType) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...initialValues
		}
	});

	useEffect(() => {
		console.log('form', form);
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
				<h3>Please enter your contact info</h3>
			</div>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First name</FormLabel>
								<FormControl>
									<Input placeholder="First name" {...field} />
								</FormControl>
								<FormDescription>This is your public first name.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Second name</FormLabel>
								<FormControl>
									<Input placeholder="Second Name" {...field} />
								</FormControl>
								<FormDescription>This is your public last name.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Email" {...field} />
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
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<Input placeholder="Phone" {...field} />
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
								<FormLabel>City</FormLabel>
								<FormControl>
									<Input placeholder="city" {...field} />
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
								<FormLabel>Postal code</FormLabel>
								<FormControl>
									<Input placeholder="Postal code" {...field} />
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
