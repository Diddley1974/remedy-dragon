import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};
  const items = await prisma.supplement.findMany({
    where,
    orderBy: { name: "asc" },
    take: 50,
    select: { slug: true, name: true, category: true, tags: true },
  });
  return NextResponse.json({ items });
}
