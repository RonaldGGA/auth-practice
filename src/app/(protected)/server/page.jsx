import React from "react";
import UserInfo from "../_components/user-info";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { Badge } from "@/components/ui/badge";

const ServerPage = async () => {
  const user = await getCurrentUser();
  console.log({ fromServer: user });
  return (
    <UserInfo label="Client Component">
      <div className="flex w-full justify-between items-center px-1 py-3 border border-gray-100 rounded">
        <p>ID</p>
        <p className="w-[200px] truncate">{user.id}</p>
      </div>
      <div className="flex w-full justify-between items-center px-1 py-3 border border-gray-100 rounded">
        <p>Name</p>
        <p className="w-[200px] truncate">{user.name}</p>
      </div>
      <div className="flex w-full justify-between items-center px-1 py-3 border border-gray-100 rounded">
        <p>Role</p>
        <p className="w-[200px] truncate">{user.role}</p>
      </div>
      <div className="flex w-full justify-between items-center px-1 py-3 border border-gray-100 rounded">
        <p>Email</p>
        <p className="w-[200px] truncate">{user.email}</p>
      </div>
      <div className="flex w-full justify-between items-center px-1 py-3 border border-gray-100 rounded">
        <p>2FA Confirmation</p>
        <div className="flex items-center justify-center w-[200px]">
          <Badge
            className="cursor-default"
            variant={user.isTwoFactorEnabled ? "success" : "destructive"}
          >
            {user.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </div>
    </UserInfo>
  );
};

export default ServerPage;
