import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Poll not found</h1>
      <p className="mt-3 text-slate-600">This poll doesn't exist or may have been removed.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
      >
        Create a new poll
      </Link>
    </main>
  );
}
