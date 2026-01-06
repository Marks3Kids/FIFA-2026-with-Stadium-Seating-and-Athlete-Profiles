import { Layout } from "@/components/Layout";
import { FileText, Scale, RefreshCw, ExternalLink, Clock, Newspaper, ChevronRight } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  time: string;
  link: string | null;
  description: string | null;
  source: string | null;
  publishedAt: string | null;
  originalTitle?: string;
  isTranslated?: boolean;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedNews, setExpandedNews] = useState<number | null>(null);
  const currentLocale = i18n.language || "en";

  const { data: news = [], isLoading, dataUpdatedAt } = useQuery<NewsItem[]>({
    queryKey: ["/api/news", currentLocale],
    queryFn: async () => {
      const response = await fetch(`/api/news?limit=3&locale=${currentLocale}`);
      if (!response.ok) throw new Error("Failed to fetch news");
      return response.json();
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });

  const handleRefreshNews = async () => {
    setIsRefreshing(true);
    try {
      await fetch("/api/news/refresh", { method: "POST" });
      await queryClient.invalidateQueries({ queryKey: ["/api/news", currentLocale] });
    } catch (error) {
      console.error("Failed to refresh news:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastUpdated = () => {
    if (!dataUpdatedAt) return "";
    const date = new Date(dataUpdatedAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleNewsClick = (item: NewsItem) => {
    if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    } else {
      setExpandedNews(expandedNews === item.id ? null : item.id);
    }
  };

  return (
    <Layout pageTitle="nav.home">
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
      </div>

      {/* Latest News - Interactive Section */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-display font-bold text-white">{t("home.latestNews")}</h2>
          </div>
          <button
            onClick={handleRefreshNews}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? t("home.news.updating") : t("home.news.refresh")}
          </button>
        </div>

        {dataUpdatedAt && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-4">
            <Clock className="w-3 h-3" />
            <span>{t("home.news.lastUpdated")}: {formatLastUpdated()}</span>
          </div>
        )}
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-white/5 p-4 rounded-xl animate-pulse">
                <div className="h-4 bg-white/10 rounded w-20 mb-3" />
                <div className="h-5 bg-white/10 rounded w-full mb-2" />
                <div className="h-5 bg-white/10 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="bg-card border border-white/5 p-6 rounded-xl text-center">
            <Newspaper className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">{t("home.news.noNews")}</p>
            <button
              onClick={handleRefreshNews}
              className="mt-3 text-primary text-sm hover:underline"
            >
              {t("home.news.tapToLoad")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <div 
                key={item.id} 
                className="group bg-card border border-white/5 rounded-xl overflow-hidden cursor-pointer active:scale-[0.99] transition-all hover:border-primary/30"
                onClick={() => handleNewsClick(item)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wider border border-accent/20 px-2 py-0.5 rounded-full bg-accent/10">
                        {item.category}
                      </span>
                      {item.source && (
                        <span className="text-[10px] text-muted-foreground">
                          {item.source}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{item.time}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  {expandedNews === item.id && item.description && (
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-t border-white/5">
                  {item.link ? (
                    <span className="text-[10px] text-primary flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {t("home.news.readFullArticle")}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      {t("home.news.tapForDetails")}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-muted-foreground text-center mt-4">
          {t("home.news.autoUpdateNotice")}
        </p>
      </div>

      {/* Legal & Terms Section */}
      <div className="px-6 pb-24">
        <div className="bg-card border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t("legal.title")}</h3>
          </div>
          
          <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
            <p>{t("legal.disclaimer")}</p>
            <p>{t("legal.noAffiliation")}</p>
            <p>{t("legal.informationalPurposes")}</p>
            <p>{t("legal.thirdPartyLinks")}</p>
            <p>{t("legal.accuracyDisclaimer")}</p>
          </div>

          <div className="border-t border-white/5 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t("legal.termsTitle")}</h4>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>{t("legal.termsAcceptance")}</p>
              <p>{t("legal.intellectualProperty")}</p>
              <p>{t("legal.liabilityLimitation")}</p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t("legal.refundTitle")}</h4>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>{t("legal.refundPolicy")}</p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t("legal.dataRetentionTitle")}</h4>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>{t("legal.dataRetention")}</p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t("legal.privacyTitle")}</h4>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>{t("legal.privacyStatement")}</p>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground/60 pt-2 border-t border-white/5">
            {t("legal.copyright")}
          </p>
        </div>
      </div>
    </Layout>
  );
}
