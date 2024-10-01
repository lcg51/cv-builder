"use server";
import { SidebarLayout } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { UserProps } from "@/lib/models";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cookies } = await import("next/headers");

  const { data } = await createClient().auth.getUser();

  return (
    <SidebarLayout
      defaultOpen={cookies().get("sidebar:state")?.value === "true"}
    >
      <AppSidebar user={data.user as unknown as UserProps} />
      <main className='flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out'>
        {children}
      </main>
    </SidebarLayout>
  );
}
