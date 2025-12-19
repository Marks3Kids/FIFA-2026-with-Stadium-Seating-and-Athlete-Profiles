import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  Sparkles, 
  User, 
  Loader2, 
  ArrowLeft,
  UtensilsCrossed,
  Hotel,
  MapPin,
  Plane,
  HelpCircle,
  RefreshCw
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Category = "dining" | "lodging" | "activities" | "travel" | "general";

interface CategoryConfig {
  id: Category;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export default function Concierge() {
  const { t, i18n } = useTranslation();
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories: CategoryConfig[] = [
    { id: "dining", icon: UtensilsCrossed, color: "text-orange-400", bgColor: "bg-orange-500/20" },
    { id: "lodging", icon: Hotel, color: "text-blue-400", bgColor: "bg-blue-500/20" },
    { id: "activities", icon: MapPin, color: "text-green-400", bgColor: "bg-green-500/20" },
    { id: "travel", icon: Plane, color: "text-purple-400", bgColor: "bg-purple-500/20" },
    { id: "general", icon: HelpCircle, color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  ];

  const getProfileContext = () => {
    try {
      const profile = localStorage.getItem("fifa2026_profile");
      if (profile) {
        const parsed = JSON.parse(profile);
        const parts: string[] = [];
        if (parsed.homeCity) parts.push(`traveling from ${parsed.homeCity}`);
        if (parsed.favoriteTeam) parts.push(`supporting ${parsed.favoriteTeam}`);
        if (parsed.travelDates) parts.push(`visiting during ${parsed.travelDates}`);
        return parts.length > 0 ? parts.join(", ") : null;
      }
    } catch {
      return null;
    }
    return null;
  };

  const getCategoryPrompts = (category: Category): string[] => {
    const prompts: Record<Category, string[]> = {
      dining: [
        t("concierge.categories.dining.prompts.bestRestaurants"),
        t("concierge.categories.dining.prompts.budgetEats"),
        t("concierge.categories.dining.prompts.localSpecialties"),
        t("concierge.categories.dining.prompts.matchDayFood"),
      ],
      lodging: [
        t("concierge.categories.lodging.prompts.nearStadium"),
        t("concierge.categories.lodging.prompts.budgetHotels"),
        t("concierge.categories.lodging.prompts.luxuryStay"),
        t("concierge.categories.lodging.prompts.airbnbVsHotel"),
      ],
      activities: [
        t("concierge.categories.activities.prompts.mustSee"),
        t("concierge.categories.activities.prompts.fanZones"),
        t("concierge.categories.activities.prompts.nightlife"),
        t("concierge.categories.activities.prompts.familyFriendly"),
      ],
      travel: [
        t("concierge.categories.travel.prompts.cityToCity"),
        t("concierge.categories.travel.prompts.airportTransfer"),
        t("concierge.categories.travel.prompts.publicTransit"),
        t("concierge.categories.travel.prompts.carRental"),
      ],
      general: [
        t("concierge.categories.general.prompts.visaInfo"),
        t("concierge.categories.general.prompts.stadiumRules"),
        t("concierge.categories.general.prompts.safetyTips"),
        t("concierge.categories.general.prompts.currencyExchange"),
      ],
    };
    return prompts[category];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (userMessages: Message[]) => {
      const profileContext = getProfileContext();
      const languageContext = i18n.language !== 'en' ? `Please respond in ${i18n.language === 'es' ? 'Spanish' : i18n.language === 'fr' ? 'French' : i18n.language === 'de' ? 'German' : i18n.language === 'nl' ? 'Dutch' : i18n.language === 'it' ? 'Italian' : i18n.language === 'pt' ? 'Portuguese' : i18n.language === 'ar' ? 'Arabic' : i18n.language === 'ja' ? 'Japanese' : 'English'}.` : '';
      
      const contextMessage = profileContext || languageContext ? {
        role: "user" as const,
        content: `[Context: ${profileContext ? `User is ${profileContext}. ` : ''}${languageContext}]`
      } : null;
      
      const messagesWithContext = contextMessage 
        ? [contextMessage, ...userMessages]
        : userMessages;
      
      const res = await apiRequest("POST", "/api/concierge/chat", { messages: messagesWithContext });
      return res.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("concierge.error") }
      ]);
    },
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;
    
    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    chatMutation.mutate(newMessages);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (chatMutation.isPending) return;
    
    const userMessage: Message = { role: "user", content: prompt };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    chatMutation.mutate(newMessages);
  };

  const handleNewConversation = () => {
    setMessages([]);
    setSelectedCategory(null);
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\n- /g, '\n• ')
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('• ')) {
          return `<div key="${i}" class="flex items-start gap-2 my-1"><span class="text-primary">•</span><span>${line.slice(2)}</span></div>`;
        }
        return `<p class="my-1">${line}</p>`;
      })
      .join('');
  };

  return (
    <Layout hideNav>
      <div className="flex flex-col h-[100dvh] bg-background">
        <div className="flex-shrink-0 bg-gradient-to-b from-card to-background border-b border-white/5 pt-12 px-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/menu")}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5 text-white rtl-flip" />
              </button>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-white">{t("concierge.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("concierge.subtitle")}</p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={handleNewConversation}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                data-testid="button-new-conversation"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col h-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center mb-3">
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-lg font-display font-bold text-white mb-1">{t("concierge.welcome")}</h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {t("concierge.welcomeMessage")}
                </p>
              </div>
              
              {!selectedCategory ? (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider text-center">{t("concierge.selectCategory")}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-card hover:border-white/20 transition-all active:scale-95`}
                          data-testid={`category-${cat.id}`}
                        >
                          <div className={`w-12 h-12 rounded-full ${cat.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${cat.color}`} />
                          </div>
                          <span className="text-sm font-medium text-white">{t(`concierge.categories.${cat.id}.title`)}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-muted-foreground text-center mb-3">{t("concierge.orTypeQuestion")}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const cat = categories.find(c => c.id === selectedCategory)!;
                        const Icon = cat.icon;
                        return (
                          <>
                            <div className={`w-8 h-8 rounded-full ${cat.bgColor} flex items-center justify-center`}>
                              <Icon className={`w-4 h-4 ${cat.color}`} />
                            </div>
                            <span className="text-sm font-medium text-white">{t(`concierge.categories.${selectedCategory}.title`)}</span>
                          </>
                        );
                      })()}
                    </div>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-xs text-muted-foreground hover:text-white transition-colors"
                      data-testid="button-change-category"
                    >
                      {t("concierge.changeCategory")}
                    </button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{t("concierge.suggestedQuestions")}</p>
                  <div className="space-y-2">
                    {getCategoryPrompts(selectedCategory).map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="w-full text-left px-4 py-3 bg-card border border-white/5 rounded-xl text-sm text-white hover:bg-white/5 hover:border-white/10 transition-colors"
                        data-testid={`quick-prompt-${selectedCategory}-${i}`}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${msg.role}-${i}`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[85%] ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                        msg.role === "user"
                          ? "bg-primary"
                          : "bg-gradient-to-br from-yellow-400 to-orange-500"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-card border border-white/5 text-muted-foreground rounded-tl-sm"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div 
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                        />
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex justify-start" data-testid="message-loading">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-card border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">{t("concierge.thinking")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="flex-shrink-0 border-t border-white/5 bg-card px-4 py-4 pb-safe">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t("concierge.inputPlaceholder")}
              className="flex-1 bg-background border border-white/10 rounded-full px-4 py-3 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              disabled={chatMutation.isPending}
              data-testid="input-chat-message"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
              data-testid="button-send-message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-3">
            {t("concierge.disclaimer")}
          </p>
        </div>
      </div>
    </Layout>
  );
}
