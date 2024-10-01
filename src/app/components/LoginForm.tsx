"use client";
import { InputText } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { logIn } from "../server-actions/session";

export default function LoginForm() {
  return (
    <div className='grid gap-4'>
      <form className='flex flex-col gap-4 items-center'>
        <InputText
          label='Email'
          type='email'
          testID='email'
          onChange={(e) => console.log(e)}
        />
        <InputText
          label='Password'
          type='password'
          testID='password'
          onChange={(e) => console.log(e)}
        />

        <Button className='w-full' onClick={() => console.log("signIn")}>
          Login
        </Button>

        <Button className='w-full' variant='outline' onClick={() => logIn()}>
          Login with GitHub
        </Button>
      </form>
    </div>
  );
}
