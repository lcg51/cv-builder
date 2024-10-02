"use client";

import Link from "next/link";
import { Package2 } from "lucide-react";
import { useDashboardNavItems } from "@/hooks/useNavItems";

export function AppSidebar() {
  const navItems = useDashboardNavItems();
  return (
    <div className='flex h-full max-h-screen flex-col gap-2'>
      <div className='flex h-full max-h-screen flex-col gap-2'>
        <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
          <Link href='/' className='flex items-center gap-2 font-semibold'>
            <Package2 className='h-6 w-6' />
            <span className=''>The original fries</span>
          </Link>
        </div>
        <div className='flex-1'>
          <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className='flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground'
              >
                {item.icon && item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
