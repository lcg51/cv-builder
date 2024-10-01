"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProps } from "@/lib/models";

function getFirstTwoCapitalLetters(str?: string | null) {
  const match = (str || "").match(/[A-Z]/g);
  return match ? match.slice(0, 2).join("") : "GT";
}

export type UserButtonProps = {
  onSignOut: () => Promise<void>;
  user: UserProps | null;
};

export default function UserButton({ onSignOut, user }: UserButtonProps) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-all'>
            <Avatar>
              <AvatarImage src={user?.image ?? ""} />
              <AvatarFallback>
                {getFirstTwoCapitalLetters(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className='overflow-hidden text-xs text-muted-foreground'>
              <div className='line-clamp-1'>{user?.email}</div>
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
