export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-now-obsidian px-6">
      <img
        src="/logo-metodo-agora.png"
        alt="Método Agora"
        className="w-48 mb-6"
      />
      <h1 className="text-4xl font-bold tracking-tight text-now-white">
        Método <span className="text-now-green">Agora</span>
      </h1>
      <p className="mt-4 text-center text-lg text-now-ivory/70 max-w-md">
        Descobre a tua Zona de Genialidade. O treino que se adapta a ti.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/quiz"
          className="rounded-full bg-now-green px-8 py-3 text-sm font-semibold text-now-obsidian transition hover:bg-now-green-dark"
        >
          Fazer o Quiz Grátis
        </a>
      </div>
    </main>
  );
}
