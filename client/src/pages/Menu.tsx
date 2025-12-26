import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { 
  Utensils, Hotel, Train, Info, Calendar, User, Settings, LogOut, Sparkles, ChevronRight, Trophy, Users, MapPin, TrendingUp, Target
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";

export default function Menu() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [showSignOut, setShowSignOut] = useState(false);
  const [customUserName, setCustomUserName] = useState<string | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem("wc2026_profile");
    if (profile) {
      try {
        const parsed = JSON.parse(profile);
        if (parsed.displayName) {
          setCustomUserName(parsed.displayName);
        }
      } catch (e) {}
    }
  }, []);

  const menuItems = [
    { id: "players", icon: Users, labelKey: "menu.players", color: "text-cyan-400", href: "/players", active: true },
    { id: "stadium-seating", icon: MapPin, labelKey: "menu.stadiumSeating", color: "text-pink-400", href: "/stadium-seating", active: true },
    { id: "transportation", icon: Train, labelKey: "menu.transportation", color: "text-blue-400", href: "/transportation", active: true },
    { id: "lodging", icon: Hotel, labelKey: "menu.lodging", color: "text-purple-400", href: "/lodging", active: true },
    { id: "dining", icon: Utensils, labelKey: "menu.dining", color: "text-orange-400", href: "/dining", active: true },
    { id: "critical-info", icon: Info, labelKey: "nav.essentialGuide", color: "text-red-400", href: "/critical-info", active: true },
    { id: "planner", icon: Calendar, labelKey: "menu.planner", color: "text-green-400", href: "/planner", active: true },
    { id: "ai-concierge", icon: Sparkles, labelKey: "menu.aiConcierge", color: "text-yellow-400", href: "/concierge", active: true },
    { id: "history", icon: Trophy, labelKey: "menu.history", color: "text-amber-400", href: "/history", active: true },
    { id: "odds", icon: TrendingUp, labelKey: "menu.odds", color: "text-lime-400", href: "/odds", active: true },
    { id: "bracket", icon: Target, labelKey: "menu.bracket", color: "text-emerald-400", href: "/bracket", active: true },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("wc2026_profile");
    localStorage.removeItem("wc2026_settings");
    setCustomUserName(null);
    setShowSignOut(false);
    setLocation("/");
  };

  return (
    <Layout pageTitle="nav.menu">
      <div className="pt-12 px-6 pb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-6 sm:mb-8">{t("menu.title")}</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {menuItems.map((item) => (
            item.active ? (
              <Link 
                key={item.id} 
                href={item.href} 
                className="bg-card border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center h-32 hover:bg-white/5 hover:border-white/10 transition-all active:scale-95"
                data-testid={`menu-item-${item.id}`}
              >
                <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
                <span className="font-bold text-white text-sm">{t(item.labelKey)}</span>
              </Link>
            ) : (
              <div 
                key={item.id} 
                className="bg-card border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center h-32 opacity-50 cursor-not-allowed relative"
                data-testid={`menu-item-${item.id}`}
              >
                <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
                <span className="font-bold text-white text-sm">{t(item.labelKey)}</span>
                <span className="absolute bottom-2 text-[10px] text-muted-foreground">{t("common.comingSoon")}</span>
              </div>
            )
          ))}
        </div>

        <h2 className="text-xl font-display font-bold text-white mb-4">{t("menu.account")}</h2>
        <div className="space-y-2">
          <Link 
            href="/profile" 
            className="w-full bg-card border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors"
            data-testid="menu-item-profile"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-medium text-white block">{customUserName || t("menu.defaultUserName")}</span>
                <span className="text-xs text-muted-foreground">{t("menu.viewEditProfile")}</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground rtl-flip" />
          </Link>

          <Link 
            href="/settings" 
            className="w-full bg-card border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors"
            data-testid="menu-item-settings"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-white">{t("menu.settings")}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground rtl-flip" />
          </Link>

          {!showSignOut ? (
            <button 
              onClick={() => setShowSignOut(true)}
              className="w-full bg-card border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors"
              data-testid="menu-item-signout"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="font-medium text-red-400">{t("menu.signOut")}</span>
              </div>
            </button>
          ) : (
            <div className="bg-card border border-white/5 p-4 rounded-xl">
              <p className="text-white font-medium mb-2">{t("menu.signOutConfirm")}</p>
              <p className="text-sm text-muted-foreground mb-4">{t("menu.signOutMessage")}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSignOut(false)}
                  className="flex-1 py-2 px-4 rounded-lg bg-white/10 text-white font-medium"
                  data-testid="button-cancel-signout"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex-1 py-2 px-4 rounded-lg bg-red-500 text-white font-medium"
                  data-testid="button-confirm-signout"
                >
                  {t("menu.signOut")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
