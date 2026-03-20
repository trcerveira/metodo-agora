export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-now-obsidian pb-20">
      {children}
    </div>
  );
}
