'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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

export type ContactFormPropsType = {
	onFieldChange?: (key: string, value: string) => void;
	onSuccess?: () => void;
};

export const ContactForm = ({ onFieldChange, onSuccess }: ContactFormPropsType) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			city: '',
			postalCode: ''
		}
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
		onSuccess?.();
	}
	return (
		<Form {...form}>
			<h3>Please enter your contact info</h3>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First name</FormLabel>
								<FormControl>
									<Input
										placeholder="First name"
										{...field}
										onChange={ev => {
											field.onChange(ev);
											onFieldChange?.('firstName', ev.target.value);
										}}
									/>
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
									<Input
										placeholder="Second Name"
										{...field}
										onChange={ev => {
											field.onChange(ev);
											onFieldChange?.('lastName', ev.target.value);
										}}
									/>
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
									<Input
										placeholder="Email"
										{...field}
										onChange={ev => {
											field.onChange(ev);
											onFieldChange?.('email', ev.target.value);
										}}
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
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<Input
										placeholder="Phone"
										{...field}
										onChange={ev => {
											field.onChange(ev);
											onFieldChange?.('phone', ev.target.value);
										}}
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
								<FormLabel>City</FormLabel>
								<FormControl>
									<Input
										placeholder="city"
										{...field}
										onChange={ev => {
											field.onChange(ev);
											onFieldChange?.('city', ev.target.value);
										}}
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
								<FormLabel>Postal code</FormLabel>
								<FormControl>
									<Input
										placeholder="Postal code"
										{...field}
										onChange={ev => {
											field.onChange(ev);
											onFieldChange?.('postalCode', ev.target.value);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit">Next Step</Button>
			</form>
		</Form>
	);
};
