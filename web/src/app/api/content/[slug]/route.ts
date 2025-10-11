import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    // ...your data fetch here
    // const item = await getContentBySlug(slug);
    // if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({
      /* item */
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
