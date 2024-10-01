"use client";
import { InputText } from "@/components/ui";
import { Button } from "@/components/ui/button";

import { signInAction } from "../server-actions/session";
import { FormMessage, Message } from "./FormMessage";

export default function LoginForm({ searchParams }: { searchParams: Message }) {
  return (
    <div className='grid gap-4'>
      <form className='flex flex-col gap-4 items-center'>
        <InputText label='Email' type='email' name='email' testID='email' />
        <InputText
          label='Password'
          type='password'
          name='password'
          testID='password'
        />

        <Button className='w-full' formAction={signInAction} type='submit'>
          Login
        </Button>

        {/* <Button className='w-full' variant='outline' onClick={() => logIn()}>
          Login with GitHub
        </Button> */}

        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
