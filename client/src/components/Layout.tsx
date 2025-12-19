import { HeaderNav } from "./HeaderNav";

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export function Layout({ children, hideNav = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {!hideNav && <HeaderNav />}
      <main className="min-h-screen relative animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}