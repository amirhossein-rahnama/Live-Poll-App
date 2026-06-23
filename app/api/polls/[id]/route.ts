import { NextResponse } from "next/server";
import { getPollResults } from "@/lib/results";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const results = await getPollResults(id);
  if (!results) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  return NextResponse.json(results);
}
