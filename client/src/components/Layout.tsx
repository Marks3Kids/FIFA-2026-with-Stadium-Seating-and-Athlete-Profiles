import { HeaderNav } from "./HeaderNav";
import { useTranslation } from "react-i18next";
import soccerBallIcon from "../assets/soccer-ball.svg";

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
        <div className="pt-3 sm:pt-4 px-3 sm:px-4">
          <div className="relative flex items-center justify-between bg-gradient-to-r from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 border border-emerald-500/20 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 gap-2">
            <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-shrink">
              <img 
                src={soccerBallIcon} 
                alt="Championship Concierge" 
                className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 shadow-lg"
              />
              <div className="min-w-0 overflow-hidden">
                <h1 className="text-sm sm:text-lg font-display font-bold leading-tight truncate whitespace-nowrap">
                  <span className="text-emerald-400">{t("header.worldCup")}</span>
                  <span className="text-white">{t("header.companion")}</span>
                </h1>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">{t("header.year")}</p>
              </div>
            </div>
            
            {!hideNav && <HeaderNav inline />}
          </div>
          
          {pageTitle && (
            <div className="flex justify-center mt-2">
              <div className="bg-primary/20 border border-primary/30 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
                <span className="text-xs sm:text-sm font-display font-semibold text-primary">{t(pageTitle)}</span>
              </div>
            </div>
          )}
        </div>
      )}
      {hideTitle && !hideNav && <HeaderNav />}
      <main className="min-h-screen relative animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
