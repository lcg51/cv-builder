import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function Dashboard() {
  return (
    <div className='h-full rounded-md border-2 border-dashed p-2'>
      <h1 className='text-4xl font-bold'>Welcome To CMS</h1>
      <SidebarTrigger />
    </div>
  );
}
