import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Home, Calendar, Flag, MapPin, Menu, Globe, ChevronDown, Train, Hotel, Utensils, Info, Sparkles, Settings, LogIn, Trophy, Users, TrendingUp, Target, CreditCard, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { getLanguageFlagUrl } from "@/lib/flags";
import { useSubscription } from "@/contexts/SubscriptionContext";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "nl", name: "Nederlands" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "ar", name: "العربية" },
  { code: "pt", name: "Português" },
  { code: "ja", name: "日本語" },
];

const NAV_ITEMS = [
  { icon: Home, labelKey: "nav.home", path: "/" },
  { icon: Flag, labelKey: "nav.teams", path: "/teams" },
  { icon: Calendar, labelKey: "nav.matches", path: "/matches" },
  { icon: Trophy, labelKey: "nav.history", path: "/history" },
  { icon: TrendingUp, labelKey: "nav.odds", path: "/odds" },
  { icon: Target, labelKey: "nav.bracket", path: "/bracket" },
  { icon: Users, labelKey: "nav.players", path: "/players" },
  { icon: MapPin, labelKey: "nav.stadiumSeating", path: "/stadium-seating" },
  { icon: MapPin, labelKey: "nav.hostCities", path: "/cities" },
  { icon: Train, labelKey: "nav.transportation", path: "/transportation" },
  { icon: Hotel, labelKey: "nav.lodging", path: "/lodging" },
  { icon: Utensils, labelKey: "nav.dining", path: "/dining" },
  { icon: Info, labelKey: "nav.essentialGuide", path: "/critical-info" },
  { icon: Sparkles, labelKey: "nav.aiConcierge", path: "/concierge" },
  { icon: Calendar, labelKey: "nav.planner", path: "/planner" },
  { icon: Tv, labelKey: "nav.watchHubs", path: "/watch-hubs" },
  { icon: CreditCard, labelKey: "nav.pricing", path: "/pricing" },
  { icon: Settings, labelKey: "nav.settings", path: "/settings" },
  { icon: LogIn, labelKey: "nav.signIn", path: "/profile" },
];

interface HeaderNavProps {
  inline?: boolean;
}

export function HeaderNav({ inline = false }: HeaderNavProps) {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const { isSubscribed } = useSubscription();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return i18n.language || localStorage.getItem("wc2026_language") || "en";
  });
  const navRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsNavOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsNavOpen(false);
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelectLanguage = (code: string) => {
    setSelectedLanguage(code);
    localStorage.setItem("wc2026_language", code);
    i18n.changeLanguage(code);
    setIsLangOpen(false);
  };

  const handleNavClick = () => {
    setIsNavOpen(false);
  };

  const currentLanguage = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];

  const containerClass = inline
    ? "flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
    : `fixed top-4 z-50 ${isRTL ? 'left-4' : 'right-4'} flex items-center gap-1.5 sm:gap-2`;

  return (
    <div className={containerClass}>
      <div className="relative" ref={langRef}>
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="flex items-center gap-1 sm:gap-1.5 bg-card/80 backdrop-blur-sm border border-white/10 rounded-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-white hover:bg-white/10 transition-colors"
          aria-label="Select language"
          aria-expanded={isLangOpen}
          aria-haspopup="listbox"
        >
          <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <img 
            src={getLanguageFlagUrl(currentLanguage.code, 40)} 
            alt={currentLanguage.name}
            className="w-4 h-3 sm:w-5 sm:h-4 object-cover rounded"
          />
        </button>

        {isLangOpen && (
          <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 bg-card border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-200`}>
            <div className="py-1 max-h-[320px] overflow-y-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors ${
                    selectedLanguage === lang.code ? "bg-primary/10 text-primary" : "text-white"
                  }`}
                >
                  <img 
                    src={getLanguageFlagUrl(lang.code, 40)} 
                    alt={lang.name}
                    className="w-6 h-4 object-cover rounded"
                  />
                  <span className="text-sm font-medium">{lang.name}</span>
                  {selectedLanguage === lang.code && (
                    <span className="ml-auto text-primary text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative" ref={navRef}>
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="flex items-center gap-1 sm:gap-1.5 bg-card/80 backdrop-blur-sm border border-white/10 rounded-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-white hover:bg-white/10 transition-colors"
          aria-label="Navigation menu"
          aria-expanded={isNavOpen}
          aria-haspopup="menu"
        >
          <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <ChevronDown className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform", isNavOpen && "rotate-180")} />
        </button>

        {isNavOpen && (
          <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 bg-card border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200`}>
            <div className="py-1">
              {NAV_ITEMS.map(({ icon: Icon, labelKey, path }) => {
                const isActive = location === path;
                return (
                  <Link
                    key={path}
                    href={path}
                    onClick={handleNavClick}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "text-white"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                    <span className="text-sm font-medium">{t(labelKey)}</span>
                    {isActive && (
                      <span className="ml-auto text-primary text-xs">●</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
