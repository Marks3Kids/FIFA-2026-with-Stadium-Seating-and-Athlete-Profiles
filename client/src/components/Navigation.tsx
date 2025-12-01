import { Link, useLocation } from "wouter";
import { Home, Calendar, Flag, MapPin, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function Navigation() {
  const [location] = useLocation();
  const { t } = useTranslation();

  const items = [
    { icon: Home, labelKey: "nav.home", path: "/" },
    { icon: Calendar, labelKey: "nav.matches", path: "/matches" },
    { icon: Flag, labelKey: "nav.teams", path: "/teams" },
    { icon: MapPin, labelKey: "nav.cities", path: "/cities" },
    { icon: Menu, labelKey: "nav.menu", path: "/menu" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {items.map(({ icon: Icon, labelKey, path }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path} className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                <span className="text-[10px] font-medium uppercase tracking-wide">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
