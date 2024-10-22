import { getCurrentUserRole } from "@/lib/getCurrentUser";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("DONE");
  const role = await getCurrentUserRole();

  if (role === UserRole.ADMIN) return new NextResponse(null, { status: 200 });
  return new NextResponse(null, { status: 403 });
}
