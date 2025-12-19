import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Home, Calendar, Flag, MapPin, Menu, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

const NAV_ITEMS = [
  { icon: Home, labelKey: "nav.home", path: "/" },
  { icon: Calendar, labelKey: "nav.matches", path: "/matches" },
  { icon: Flag, labelKey: "nav.teams", path: "/teams" },
  { icon: MapPin, labelKey: "nav.cities", path: "/cities" },
  { icon: Menu, labelKey: "nav.menu", path: "/menu" },
];

export function HeaderNav() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
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

  return (
    <div className={`fixed top-4 z-50 ${isRTL ? 'left-4' : 'right-4'} flex items-center gap-2`}>
      <div className="relative" ref={langRef}>
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-white/10 rounded-full px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
          aria-label="Select language"
          aria-expanded={isLangOpen}
          aria-haspopup="listbox"
        >
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium">{currentLanguage.flag}</span>
        </button>

        {isLangOpen && (
          <div className="absolute right-0 top-full mt-2 bg-card border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="py-1 max-h-[320px] overflow-y-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors ${
                    selectedLanguage === lang.code ? "bg-primary/10 text-primary" : "text-white"
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
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
          className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-white/10 rounded-full px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
          aria-label="Navigation menu"
          aria-expanded={isNavOpen}
          aria-haspopup="menu"
        >
          <Menu className="w-4 h-4 text-primary" />
          <ChevronDown className={cn("w-3 h-3 transition-transform", isNavOpen && "rotate-180")} />
        </button>

        {isNavOpen && (
          <div className="absolute right-0 top-full mt-2 bg-card border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
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
