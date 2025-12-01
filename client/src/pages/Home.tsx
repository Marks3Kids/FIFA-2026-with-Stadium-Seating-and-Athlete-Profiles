import { Layout } from "@/components/Layout";
import { ArrowRight, MapPin, Shield } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import potsBg from "@assets/image_1764366081093.png";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  time: string;
}

export default function Home() {
  const { t } = useTranslation();
  const { data: news = [] } = useQuery<NewsItem[]>({
    queryKey: ["/api/news"],
    queryFn: async () => {
      const response = await fetch("/api/news");
      if (!response.ok) throw new Error("Failed to fetch news");
      return response.json();
    },
  });

  return (
    <Layout>
      {/* Hero Header */}
      <div className="pt-8 px-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center space-x-2 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full w-fit border border-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-bold uppercase text-primary-foreground tracking-wider">{t("common.liveUpdates")}</span>
          </div>
        </div>
        
        <h1 className="text-5xl font-display font-bold leading-none text-white mb-2">
          {t("home.title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t("home.year")}</span>
        </h1>
        <p className="text-lg text-gray-300 font-light tracking-wide">
          {t("home.tagline")}
        </p>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          {t("home.updateInfo")}
        </p>
      </div>

      {/* POT Draw Image - Full Width */}
      <div className="px-4 py-4">
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img 
            src={potsBg} 
            alt={t("home.potDrawAlt")}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-card border border-white/10 rounded-xl p-4 text-center">
            <span className="block text-3xl font-bold font-display text-white">48</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("common.teams")}</span>
          </div>
          <div className="bg-card border border-white/10 rounded-xl p-4 text-center">
            <span className="block text-3xl font-bold font-display text-white">16</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("common.cities")}</span>
          </div>
          <div className="bg-card border border-white/10 rounded-xl p-4 text-center">
            <span className="block text-3xl font-bold font-display text-white">104</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("common.matches")}</span>
          </div>
        </div>

        <Link href="/matches" className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <span className="uppercase tracking-widest text-sm">{t("home.viewSchedule")}</span>
            <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Latest Updates */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-white">{t("home.latestNews")}</h2>
          <Link href="/updates" className="text-xs font-bold text-primary uppercase tracking-widest hover:text-primary/80">{t("common.viewAll")}</Link>
        </div>
        
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="group bg-card border border-white/5 p-4 rounded-xl active:scale-[0.99] transition-transform">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider border border-accent/20 px-2 py-0.5 rounded-full bg-accent/10">
                  {item.category}
                </span>
                <span className="text-[10px] text-muted-foreground">{item.time}</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Sections */}
      <div className="px-6 pb-24">
        <h2 className="text-2xl font-display font-bold text-white mb-6">{t("home.explore")}</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/cities" className="bg-card border border-white/5 p-4 rounded-xl h-32 flex flex-col justify-between group hover:border-primary/50 transition-colors">
              <MapPin className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <span className="block text-sm font-bold text-white">{t("home.hostCities")}</span>
                <span className="text-[10px] text-muted-foreground">{t("home.discoverVenues")}</span>
              </div>
          </Link>
          <Link href="/teams" className="bg-card border border-white/5 p-4 rounded-xl h-32 flex flex-col justify-between group hover:border-primary/50 transition-colors">
              <Shield className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
              <div>
                <span className="block text-sm font-bold text-white">{t("home.qualifiedTeams")}</span>
                <span className="text-[10px] text-muted-foreground">{t("home.seeWhoQualified")}</span>
              </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
