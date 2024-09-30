"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSession } from "next-auth/react";

function getFirstTwoCapitalLetters(str?: string | null) {
  const match = (str || "").match(/[A-Z]/g);
  return match ? match.slice(0, 2).join("") : "GT";
}

export type UserButtonProps = {
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
};

export default function UserButton({ onSignOut }: UserButtonProps) {
  const { data: session } = useSession();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-all'>
            <Avatar>
              <AvatarImage src={session?.user?.image ?? ""} />
              <AvatarFallback>
                {getFirstTwoCapitalLetters(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className='overflow-hidden text-xs text-muted-foreground'>
              <div className='line-clamp-1'>{session?.user?.email}</div>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              onSignOut();
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
