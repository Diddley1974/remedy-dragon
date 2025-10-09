// web/src/app/api/dbcheck/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const userCount = await prisma.user.count();
  return NextResponse.json({
    ok: true,
    time: new Date().toISOString(),
    userCount,
    env: process.env.APP_ENV ?? "unknown",
  });
}
