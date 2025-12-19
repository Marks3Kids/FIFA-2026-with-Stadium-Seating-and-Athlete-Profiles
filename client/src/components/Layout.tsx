import { HeaderNav } from "./HeaderNav";
import { useTranslation } from "react-i18next";

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  hideTitle?: boolean;
}

export function Layout({ children, hideNav = false, hideTitle = false }: LayoutProps) {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {!hideNav && <HeaderNav />}
      {!hideTitle && (
        <div className="pt-4 px-4">
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#003087]/20 via-[#8B0A50]/10 to-[#003087]/20 border border-white/10 rounded-xl px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003087] via-[#8B0A50] to-[#D4AF37] flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.3"/>
                <path d="M12 6l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L7 9.5l3.5-.5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-display font-bold leading-tight">
                <span className="text-[#D4AF37]">World Cup</span>{" "}
                <span className="text-white">Companion</span>
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">2026</p>
            </div>
          </div>
        </div>
      )}
      <main className="min-h-screen relative animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}