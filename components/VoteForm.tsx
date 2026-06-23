"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CopyLinkButton from "@/components/CopyLinkButton";

type Option = { id: string; text: string };

export default function VoteForm({
  pollId,
  question,
  options,
}: {
  pollId: string;
  question: string;
  options: Option[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  useEffect(() => {
    setAlreadyVoted(localStorage.getItem(`voted:${pollId}`) === "true");
  }, [pollId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) {
      setError("Please select an option.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selected }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Could not record your vote.");
      }

      localStorage.setItem(`voted:${pollId}`, "true");
      router.push(`/poll/${pollId}/results`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record your vote.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">{question}</h1>

        {alreadyVoted && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            You've already voted from this browser. You can vote again, or{" "}
            <Link href={`/poll/${pollId}/results`} className="font-medium underline">
              view the results
            </Link>
            .
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-2">
          {options.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                selected === option.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="option"
                value={option.id}
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
                className="h-4 w-4 accent-indigo-600"
              />
              <span className="text-slate-900">{option.text}</span>
            </label>
          ))}

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Vote"}
          </button>
        </form>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link
          href={`/poll/${pollId}/results`}
          className="font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          View results →
        </Link>
        <CopyLinkButton path={`/poll/${pollId}`} />
      </div>
    </>
  );
}
