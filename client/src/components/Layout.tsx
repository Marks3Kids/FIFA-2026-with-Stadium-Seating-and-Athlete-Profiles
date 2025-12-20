import { HeaderNav } from "./HeaderNav";
import { useTranslation } from "react-i18next";

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  hideTitle?: boolean;
  pageTitle?: string;
}

export function Layout({ children, hideNav = false, hideTitle = false, pageTitle }: LayoutProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <div 
      className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {!hideTitle && (
        <div className="pt-4 px-4">
          <div className="relative flex items-center justify-between bg-gradient-to-r from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 border border-emerald-500/20 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <polygon points="12,2 14.5,8 21,8.5 16,13 17.5,20 12,16.5 6.5,20 8,13 3,8.5 9.5,8" fill="currentColor" opacity="0.3"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="0.75" opacity="0.5"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-display font-bold leading-tight">
                  <span className="text-emerald-400">{t("header.worldCup")}</span>{" "}
                  <span className="text-white">{t("header.companion")}</span>
                </h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t("header.year")}</p>
              </div>
            </div>
            
            {!hideNav && <HeaderNav inline />}
            
            {pageTitle && (
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5">
                  <span className="text-sm font-display font-semibold text-primary">{t(pageTitle)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {hideTitle && !hideNav && <HeaderNav />}
      <main className="min-h-screen relative animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
