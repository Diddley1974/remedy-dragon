import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Session } from "next-auth";

type ConsentType = "privacy_policy" | "data_processing";
type Consent = { type: ConsentType; withdrawn?: boolean };

type PostBody = {
  displayName?: string | null;
  age?: number | null;
  sex?: string | null;
  medications?: string[];
  conditions?: string[];
  consents?: Consent[];
};

function getUserId(session: Session | null): string | null {
  const id = session?.user && (session.user as { id?: unknown }).id;
  return typeof id === "string" ? id : null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profile, consents] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.consent.findMany({ where: { userId } }),
  ]);

  return NextResponse.json({ profile, consents });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: PostBody = {};
  try {
    body = (await req.json()) as PostBody;
  } catch {
    // keep default empty body
  }

  const {
    displayName = null,
    age = null,
    sex = null,
    medications = [],
    conditions = [],
    consents = [],
  } = body;

  await prisma.profile.upsert({
    where: { userId },
    update: { displayName, age, sex, medications, conditions },
    create: { userId, displayName, age, sex, medications, conditions },
  });

  if (Array.isArray(consents)) {
    for (const c of consents) {
      if (!c?.type) continue;
      const id = `${userId}:${c.type}`;
      await prisma.consent.upsert({
        where: { id },
        update: { withdrawn: Boolean(c.withdrawn) },
        create: { id, userId, type: c.type, withdrawn: Boolean(c.withdrawn) },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
