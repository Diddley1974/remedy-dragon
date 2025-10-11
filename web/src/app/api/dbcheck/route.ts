// web/src/app/api/dbcheck/route.ts
// src/app/api/dbcheck/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const rows = await prisma.$queryRaw<{ search_path: string }[]>`SHOW search_path`;
  const searchPath = rows[0]?.search_path ?? "";
  return NextResponse.json({ searchPath });
}

/*
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.DATABASE_URL?.replace(/:\/\/.*@/, "://***@");
  const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
    select table_name from information_schema.tables
    where table_schema='public' order by 1`;
  const rows = await prisma.$queryRaw<{ search_path: string }>`SHOW search_path`;
  const searchPath = rows[0]?.search_path ?? "";

  return NextResponse.json({
    url,
    searchPath,
    tables: tables.map((t) => t.table_name), // t is typed
  });
}
*/
/*
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";

export async function GET() {
  const userCount = await prisma.user.count();
  return NextResponse.json({
    ok: true,
    time: new Date().toISOString(),
    userCount,
    env: process.env.APP_ENV ?? "unknown",
  });
}  */

/*
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const rows = await prisma.$queryRaw<Array<{table_name:string}>>`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema='public' ORDER BY 1;
  `
  return NextResponse.json({ tables: rows.map(r => r.table_name) })
}  */
