import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { voteSchema, formatZodIssues } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: pollId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = voteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: formatZodIssues(parsed.error) },
      { status: 400 },
    );
  }

  const option = await prisma.option.findFirst({
    where: { id: parsed.data.optionId, pollId },
    select: { id: true },
  });
  if (!option) {
    return NextResponse.json({ error: "That option does not belong to this poll" }, { status: 404 });
  }

  await prisma.vote.create({ data: { optionId: option.id, pollId } });

  return NextResponse.json({ ok: true }, { status: 201 });
}
