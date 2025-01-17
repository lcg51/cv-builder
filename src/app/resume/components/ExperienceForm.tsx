'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
	jobtitle: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	employer: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	})
});

export const ExperienceForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			jobtitle: '',
			employer: ''
		}
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}
	return (
		<Form {...form}>
			<h3>Tell us about the experience</h3>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					<FormField
						control={form.control}
						name="jobtitle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Job title</FormLabel>
								<FormControl>
									<Input placeholder="Job title" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="employer"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Second name</FormLabel>
								<FormControl>
									<Input placeholder="Employer" {...field} />
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
