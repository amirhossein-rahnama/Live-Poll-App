import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPollSchema, formatZodIssues } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = createPollSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: formatZodIssues(parsed.error) },
      { status: 400 },
    );
  }

  const { question, options } = parsed.data;

  const poll = await prisma.poll.create({
    data: {
      question,
      options: { create: options.map((text, index) => ({ text, order: index })) },
    },
    select: { id: true },
  });

  return NextResponse.json({ id: poll.id }, { status: 201 });
}
