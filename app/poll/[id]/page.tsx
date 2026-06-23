import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VoteForm from "@/components/VoteForm";

export default async function VotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const poll = await prisma.poll.findUnique({
    where: { id },
    include: { options: { orderBy: { order: "asc" }, select: { id: true, text: true } } },
  });

  if (!poll) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <VoteForm pollId={poll.id} question={poll.question} options={poll.options} />
    </main>
  );
}
