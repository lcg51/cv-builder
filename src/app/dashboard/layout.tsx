"use server";
import { SidebarLayout } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/Sidebar";
import { auth as getServerSession } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cookies } = await import("next/headers");
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarLayout
      defaultOpen={cookies().get("sidebar:state")?.value === "true"}
    >
      <AppSidebar />
      <main className='flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out'>
        {children}
      </main>
    </SidebarLayout>
  );
}
