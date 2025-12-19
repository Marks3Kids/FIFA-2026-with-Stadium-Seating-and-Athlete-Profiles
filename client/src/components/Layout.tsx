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
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 border border-emerald-500/20 rounded-xl px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <polygon points="12,2 14.5,8 21,8.5 16,13 17.5,20 12,16.5 6.5,20 8,13 3,8.5 9.5,8" fill="currentColor" opacity="0.3"/>
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1"/>
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="0.75" opacity="0.5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-display font-bold leading-tight">
                <span className="text-emerald-400">World Cup</span>{" "}
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