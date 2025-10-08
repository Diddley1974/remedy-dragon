export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Remedy Dragon</h1>
      <p className="mt-3">
        Educational information about supplements and Traditional Chinese Medicine (TCM).
      </p>

      <div className="mt-6 rounded-lg border p-3 text-sm">
        <strong>Important:</strong> Remedy Dragon does not provide medical advice, diagnosis, or treatment.
        For urgent symptoms, call emergency services immediately.
      </div>

      <div className="mt-8 grid gap-3">
        <a className="underline" href="#">Browse supplements (coming soon)</a>
        <a className="underline" href="#">Explore TCM remedies (coming soon)</a>
        <a className="underline" href="#">Try the symptom checker (coming soon)</a>
      </div>
    </main>
  );
}

