import { Navigation } from "./Navigation";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "react-i18next";

interface LayoutProps {
  children: React.ReactNode;
  hideBottomNav?: boolean;
}

export function Layout({ children, hideBottomNav = false }: LayoutProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <div className={`fixed top-4 z-50 ${isRTL ? 'left-4' : 'right-4'}`}>
        <LanguageSelector />
      </div>
      <main className={`${hideBottomNav ? '' : 'pb-24'} min-h-screen relative animate-in fade-in duration-500`}>
        {children}
      </main>
      {!hideBottomNav && <Navigation />}
    </div>
  );
}