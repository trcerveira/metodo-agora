export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-fyvr-black px-6">
      <h1 className="text-5xl font-bold tracking-tight text-fyvr-white">
        FY<span className="text-fyvr-accent">VR</span>
      </h1>
      <p className="mt-4 text-lg text-fyvr-gray-400">
        Hybrid training, powered by your DISC profile.
      </p>
      <div className="mt-8">
        <a
          href="/today"
          className="rounded-full bg-fyvr-accent px-8 py-3 text-sm font-semibold text-fyvr-white transition hover:bg-fyvr-accent-light"
        >
          Get Started
        </a>
      </div>
    </main>
  );
}
