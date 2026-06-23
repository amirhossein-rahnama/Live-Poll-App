import { notFound } from "next/navigation";
import { getPollResults } from "@/lib/results";
import Results from "@/components/Results";

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const initial = await getPollResults(id);
  if (!initial) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <Results pollId={id} initial={initial} />
    </main>
  );
}
