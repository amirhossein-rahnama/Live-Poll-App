"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CopyLinkButton from "@/components/CopyLinkButton";
import type { PollResults } from "@/lib/types";

const POLL_INTERVAL_MS = 2000;
const BAR_COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
];

export default function Results({
  pollId,
  initial,
}: {
  pollId: string;
  initial: PollResults;
}) {
  const [data, setData] = useState<PollResults>(initial);
  const [live, setLive] = useState(true);

  useEffect(() => {
    let active = true;

    const tick = async () => {
      try {
        const res = await fetch(`/api/polls/${pollId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("bad status");
        const fresh: PollResults = await res.json();
        if (active) {
          setData(fresh);
          setLive(true);
        }
      } catch {
        if (active) setLive(false);
      }
    };

    const interval = setInterval(tick, POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [pollId]);

  const total = data.totalVotes;
  const maxVotes = Math.max(0, ...data.options.map((o) => o.votes));

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{data.question}</h1>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              live ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                live ? "animate-pulse bg-emerald-500" : "bg-slate-400"
              }`}
            />
            {live ? "Live" : "Reconnecting..."}
          </span>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          {total} {total === 1 ? "vote" : "votes"}
        </p>

        <ul className="mt-6 space-y-4">
          {data.options.map((option, index) => {
            const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0;
            const leading = total > 0 && option.votes === maxVotes;
            return (
              <li key={option.id}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className={leading ? "font-semibold text-slate-900" : "text-slate-700"}>
                    {option.text}
                    {leading ? " 👑" : ""}
                  </span>
                  <span className="shrink-0 tabular-nums text-slate-500">
                    {pct}% · {option.votes}
                  </span>
                </div>
                <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${BAR_COLORS[index % BAR_COLORS.length]} transition-all duration-500 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        {total === 0 && (
          <p className="mt-6 text-center text-sm text-slate-400">No votes yet - be the first!</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link
          href={`/poll/${pollId}`}
          className="font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          ← Back to voting
        </Link>
        <CopyLinkButton path={`/poll/${pollId}`} />
      </div>
    </>
  );
}
