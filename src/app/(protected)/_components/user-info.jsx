import { Card, CardHeader, CardContent } from "@/components/ui/card";

import React from "react";

const UserInfo = ({ children, label }) => {
  return (
    <Card>
      <CardHeader>{label}</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default UserInfo;
