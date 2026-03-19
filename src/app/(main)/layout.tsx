export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-fyvr-black pb-20">
      {children}
    </div>
  );
}
