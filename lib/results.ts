import { prisma } from "@/lib/prisma";
import type { PollResults } from "@/lib/types";

export async function getPollResults(pollId: string): Promise<PollResults | null> {
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      options: {
        orderBy: { order: "asc" },
        include: { _count: { select: { votes: true } } },
      },
    },
  });

  if (!poll) return null;

  const options = poll.options.map((option) => ({
    id: option.id,
    text: option.text,
    order: option.order,
    votes: option._count.votes,
  }));

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  return {
    id: poll.id,
    question: poll.question,
    createdAt: poll.createdAt.toISOString(),
    totalVotes,
    options,
  };
}
