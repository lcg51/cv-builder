'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

import { googleSignIn } from '../server-actions/session';
import { FormMessage, Message } from './FormMessage';

export default function LoginForm({ searchParams }: { searchParams: Message }) {
	return (
		<div className="grid gap-4">
			<form action={googleSignIn} className="flex flex-col gap-4 items-center">
				{/* <InputText label="Email" type="email" name="email" testID="email" />
				<InputText label="Password" type="password" name="password" testID="password" />

				<Button className="w-full" formAction={signInAction} type="submit">
					Login
				</Button> */}

				<Button variant="outline" formAction={googleSignIn} className="w-full">
					SignIn with Google
				</Button>

				<FormMessage message={searchParams} />
			</form>
		</div>
	);
}
