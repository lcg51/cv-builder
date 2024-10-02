"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/utils/utils";


export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/login", error.message);
  }

  return redirect("/dashboard");
};


export const signOut = async () => {

  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  console.log("signOut error", error);

  if(error) {
    return encodedRedirect("error", "/login", error.message);
  }

  return redirect("/login");

};