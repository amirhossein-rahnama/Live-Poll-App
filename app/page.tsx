import CreatePollForm from "@/components/CreatePollForm";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Create a live poll
        </h1>
        <p className="mt-3 text-slate-600">
          Ask a question, add 2-5 options, and share the link. Results update in real time.
        </p>
      </header>
      <CreatePollForm />
    </main>
  );
}
