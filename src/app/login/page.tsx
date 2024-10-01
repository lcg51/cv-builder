import Image from "next/image";

import { auth as getServerSession } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "../components/LoginForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function Login() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className='w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]'>
      <div className='h-screen flex items-center justify-center'>
        <Card className='w-[350px]'>
          <CardHeader className='text-center'>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your email below to login into your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
      <div className='hidden bg-muted lg:block'>
        <Image
          src='/assets/placeholder.svg'
          alt='Image'
          width='1920'
          height='1080'
          className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>
    </div>
  );
}
