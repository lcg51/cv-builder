import { auth as getServerSession } from "@/auth";
import { redirect } from "next/navigation";
import LoginButton from "../components/LoginButton";

export default async function Login() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className='h-full rounded-md border-2 border-dashed p-2'>
      <h1 className='text-4xl font-bold'>Login</h1>

      <LoginButton />
    </div>
  );
}
