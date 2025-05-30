import { MainNav } from "@/components/ui/main-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 flex">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}