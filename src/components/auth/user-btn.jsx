import React from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import { logout } from "@/lib/actions";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const UserBtn = () => {
  const user = useCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-rounded-full bg-blue-600">
            <PersonIcon className="text-white " />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent w="40" align="end">
        <DropdownMenuItem onClick={() => logout()}>
          <ExitIcon />
          LogOut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserBtn;
