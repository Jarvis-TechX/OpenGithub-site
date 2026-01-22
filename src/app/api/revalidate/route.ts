import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const token = req.headers.get("x-revalidate-token") ?? new URL(req.url).searchParams.get("token");
  const expected = process.env.REVALIDATE_TOKEN;

  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const paths: string[] = Array.isArray(body?.paths) ? body.paths : ["/"];
  for (const p of paths) {
    if (typeof p === "string" && p.startsWith("/")) revalidatePath(p);
  }

  return NextResponse.json({ ok: true, revalidated: paths });
}

