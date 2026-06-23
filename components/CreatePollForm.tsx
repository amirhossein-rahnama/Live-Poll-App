"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MAX_OPTIONS, MIN_OPTIONS, OPTION_MAX, QUESTION_MAX } from "@/lib/validation";

export default function CreatePollForm() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateOption(index: number, value: string) {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  }

  function addOption() {
    setOptions((prev) => (prev.length < MAX_OPTIONS ? [...prev, ""] : prev));
  }

  function removeOption(index: number) {
    setOptions((prev) => (prev.length > MIN_OPTIONS ? prev.filter((_, i) => i !== index) : prev));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedQuestion = question.trim();
    const trimmedOptions = options.map((opt) => opt.trim()).filter(Boolean);

    if (!trimmedQuestion) {
      setError("Please enter a question.");
      return;
    }
    if (trimmedOptions.length < MIN_OPTIONS) {
      setError(`Please provide at least ${MIN_OPTIONS} non-empty options.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion, options: trimmedOptions }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.issues?.[0]?.message ?? data?.error ?? "Something went wrong.");
      }

      const { id } = await res.json();
      router.push(`/poll/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <label htmlFor="question" className="block text-sm font-medium text-slate-700">
        Question
      </label>
      <input
        id="question"
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        maxLength={QUESTION_MAX}
        placeholder="What should we build next?"
        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Options</span>
          <span className="text-xs text-slate-400">
            {options.length}/{MAX_OPTIONS}
          </span>
        </div>

        <div className="mt-2 space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                maxLength={OPTION_MAX}
                placeholder={`Option ${i + 1}`}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <button
                type="button"
                onClick={() => removeOption(i)}
                disabled={options.length <= MIN_OPTIONS}
                aria-label={`Remove option ${i + 1}`}
                className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {options.length < MAX_OPTIONS && (
          <button
            type="button"
            onClick={addOption}
            className="mt-3 text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            + Add option
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create poll"}
      </button>
    </form>
  );
}
