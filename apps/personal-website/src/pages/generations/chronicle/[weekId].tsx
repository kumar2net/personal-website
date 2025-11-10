import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChronicleView() {
  const { weekId } = useParams();
  const [chronicle, setChronicle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/generations/chronicle?week=${weekId}`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setChronicle)
      .catch((err) => setError(String(err)));
  }, [weekId]);

  if (error) return <div className="p-12 text-center text-red-500">Error loading chronicle.</div>;
  if (!chronicle) return <div className="p-12 text-center text-gray-500">Loading...</div>;

  return (
    <section className="p-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-amber-700 mb-6">
        Family Chronicle — {weekId}
      </h1>
      <article className="prose prose-lg text-gray-700 whitespace-pre-line leading-relaxed">
        {chronicle.text}
      </article>
    </section>
  );
}
