'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StepsBarComponentProps } from '@/components/ui/StepsBar/StepsBar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AboutIcon, ArrowRightIcon } from '@/components/icons/FormIcons';

const formSchema = z.object({
	aboutMe: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	github: z
		.string()
		.url({
			message: 'Please enter a valid URL.'
		})
		.refine(url => url === '' || url.includes('github.com'), {
			message: 'Please enter a valid GitHub URL (must contain github.com)'
		})
		.optional()
		.or(z.literal('')),
	linkedin: z
		.string()
		.url({
			message: 'Please enter a valid URL.'
		})
		.refine(url => url === '' || url.includes('linkedin.com'), {
			message: 'Please enter a valid LinkedIn URL (must contain linkedin.com)'
		})
		.optional()
		.or(z.literal(''))
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
	function onSubmit() {
		onSuccess?.();
	}
	return (
		<Form {...form}>
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-3">
					<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
						<AboutIcon color="black" />
					</div>
					<div>
						<h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
							Professional Summary
						</h3>
						<p className="text-slate-600 dark:text-slate-400">
							Write a brief summary that highlights your key achievements and career goals
						</p>
					</div>
				</div>
			</div>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 space-y-6">
					<FormField
						control={form.control}
						name="aboutMe"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
									Professional Summary
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="I am a passionate software engineer with 5+ years of experience in full-stack development. I specialize in building scalable web applications using modern technologies and frameworks. My goal is to create innovative solutions that drive business growth and enhance user experiences."
										className="min-h-32 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
										{...field}
									/>
								</FormControl>
								<div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
									Tip: Keep it concise and highlight your most relevant skills and achievements (2-3
									sentences recommended)
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="github"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
									GitHub Profile
								</FormLabel>
								<FormControl>
									<Input
										placeholder="https://github.com/yourusername"
										className="border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
										{...field}
									/>
								</FormControl>
								<div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
									Tip: Include your full GitHub profile URL to showcase your projects and
									contributions
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="linkedin"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
									LinkedIn Profile
								</FormLabel>
								<FormControl>
									<Input
										placeholder="https://linkedin.com/in/yourusername"
										className="border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
										{...field}
									/>
								</FormControl>
								<div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
									Tip: Include your full LinkedIn profile URL to connect with potential employers
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
					<div className="text-sm text-slate-500 dark:text-slate-400">Step 5 of 6</div>
					<Button variant="default" type="submit" className="px-2 py-2 h-11">
						Continue
						<ArrowRightIcon className="w-4 h-4" />
					</Button>
				</div>
			</form>
		</Form>
	);
};
