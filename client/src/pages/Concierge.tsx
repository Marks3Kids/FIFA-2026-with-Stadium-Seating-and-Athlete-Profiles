import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  Sparkles, 
  User, 
  Loader2, 
  ArrowLeft,
  RefreshCw,
  Info,
  CreditCard,
  Thermometer,
  Droplets,
  Bell,
  MapPin,
  Volume2,
  AlertTriangle,
  MessageCircle,
  ShoppingCart
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { VoiceConcierge, TalkToConciergeButton } from "@/components/VoiceConcierge";
import { useLocation as useGeoLocation } from "@/contexts/LocationContext";
import { generateWeatherAlert, getHydrationRecommendations, getCoolingStations } from "@/services/WeatherService";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface MessageUsage {
  messagesUsed: number;
  bonusMessages: number;
  totalAvailable: number;
  remaining: number;
  monthYear: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Concierge() {
  const { t, i18n } = useTranslation();
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [lastSpokenMessage, setLastSpokenMessage] = useState("");
  const [showAlerts, setShowAlerts] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  
  const { email } = useSubscription();
  const { currentCity, currentVault } = useGeoLocation();

  const { data: usageData, refetch: refetchUsage } = useQuery<MessageUsage>({
    queryKey: ['ai-message-usage', email],
    queryFn: async () => {
      if (!email) return null;
      const res = await fetch(`/api/ai-messages/usage?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('Failed to fetch usage');
      return res.json();
    },
    enabled: !!email,
    staleTime: 30 * 1000,
  });

  const { data: weatherData } = useQuery({
    queryKey: ['weather', currentCity?.cityKey],
    queryFn: async () => {
      if (!currentCity?.cityKey) return null;
      const res = await fetch(`/api/weather/${currentCity.cityKey}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!currentCity?.cityKey,
    staleTime: 30 * 60 * 1000,
  });

  const weatherAlert = weatherData && currentCity?.cityKey 
    ? generateWeatherAlert(weatherData, currentCity.cityKey) 
    : null;

  const hydrationTips = weatherData?.temperatureF >= 85 
    ? getHydrationRecommendations(weatherData.temperatureF) 
    : [];

  const coolingStations = currentCity?.cityKey 
    ? getCoolingStations(currentCity.cityKey) 
    : [];

  const quickPrompts = [
    t("concierge.quickPrompts.restaurants"),
    t("concierge.quickPrompts.hotels"),
    t("concierge.quickPrompts.transportation"),
    t("concierge.quickPrompts.stadiumTips"),
  ];

  const handleTalkToConcierge = () => {
    const greeting = currentCity 
      ? `Welcome to ${currentCity.name}! ${currentVault?.motto || ''} How can I help you today?`
      : t("concierge.voiceGreeting");
    
    setLastSpokenMessage(greeting);
  };

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBuyMoreMessages = async () => {
    if (!email || isPurchasing) return;
    setIsPurchasing(true);
    try {
      const res = await fetch('/api/ai-messages/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const purchaseStatus = urlParams.get('purchase');
    const sessionId = urlParams.get('session_id');
    
    if (purchaseStatus === 'success' && email && sessionId) {
      fetch('/api/ai-messages/add-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sessionId }),
      }).then(async (res) => {
        if (res.ok || res.status === 409) {
          refetchUsage();
          setLimitReached(false);
        }
        window.history.replaceState({}, '', '/concierge');
      }).catch(() => {
        window.history.replaceState({}, '', '/concierge');
      });
    } else if (purchaseStatus === 'cancelled') {
      window.history.replaceState({}, '', '/concierge');
    }
  }, [email, refetchUsage]);

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
      
      const res = await apiRequest("POST", "/api/concierge/chat", { 
        messages: messagesWithContext,
        email 
      });
      
      if (res.status === 403) {
        const data = await res.json();
        if (data.limitReached) {
          setLimitReached(true);
          throw new Error('limit_reached');
        }
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (data.usage) {
        queryClient.setQueryData(['ai-message-usage', email], data.usage);
      }
    },
    onError: (error: Error) => {
      if (error.message === 'limit_reached') {
        return;
      }
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
    <Layout hideNav hideTitle>
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
            <div className="flex items-center gap-2">
              {usageData && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full text-xs">
                  <MessageCircle className="w-3.5 h-3.5 text-primary" />
                  <span className={`font-medium ${usageData.remaining <= 5 ? 'text-orange-400' : 'text-white'}`}>
                    {usageData.remaining}/{usageData.totalAvailable}
                  </span>
                </div>
              )}
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
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col h-full">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center mb-3">
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-lg font-display font-bold text-white mb-1">{t("concierge.welcome")}</h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {t("concierge.welcomeMessage")}
                </p>
              </div>

              <div className="mb-4">
                <TalkToConciergeButton onActivate={handleTalkToConcierge} />
                {lastSpokenMessage && (
                  <div className="mt-2 flex justify-center">
                    <VoiceConcierge text={lastSpokenMessage} autoSpeak={true} />
                  </div>
                )}
              </div>

              {(currentCity || weatherAlert) && (
                <div className="mb-4 space-y-3">
                  {currentCity && (
                    <div className="bg-gradient-to-r from-primary/20 to-emerald-600/20 rounded-xl p-4 border border-primary/30">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="font-bold text-white">{t("location.youAreIn", { city: currentCity.name })}</span>
                      </div>
                      {currentVault && (
                        <p className="text-sm text-gray-300 italic">"{currentVault.motto}"</p>
                      )}
                      {weatherData && (
                        <div className="mt-3 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Thermometer className="w-4 h-4 text-orange-400" />
                            <span className="text-white">{weatherData.temperatureF}°F</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets className="w-4 h-4 text-blue-400" />
                            <span className="text-muted-foreground">{weatherData.humidity}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {weatherAlert && (
                    <div className={`rounded-xl p-4 border ${
                      weatherAlert.severity === 'high' 
                        ? 'bg-red-500/20 border-red-500/50' 
                        : weatherAlert.severity === 'medium'
                        ? 'bg-orange-500/20 border-orange-500/50'
                        : 'bg-yellow-500/20 border-yellow-500/50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="w-5 h-5 text-orange-400" />
                        <span className="font-bold text-white">{weatherAlert.message}</span>
                      </div>
                      <p className="text-sm text-gray-300">{weatherAlert.recommendation}</p>
                      {hydrationTips.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {hydrationTips.slice(0, 3).map((tip, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                              <Droplets className="w-3 h-3 mt-0.5 text-blue-400" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider text-center">{t("concierge.tryAsking")}</p>
                <div className="space-y-2">
                  {quickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full text-left px-4 py-3 bg-card border border-white/5 rounded-xl text-sm text-white hover:bg-white/5 hover:border-white/10 transition-colors active:scale-[0.98]"
                      data-testid={`quick-prompt-${i}`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
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
                        <>
                          <div 
                            className="text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                          />
                          <div className="flex justify-end mt-2 pt-2 border-t border-white/5">
                            <VoiceConcierge text={msg.content} />
                          </div>
                        </>
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
              placeholder={limitReached ? "Message limit reached" : t("concierge.inputPlaceholder")}
              className="flex-1 bg-background border border-white/10 rounded-full px-4 py-3 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:opacity-50"
              disabled={chatMutation.isPending || limitReached}
              data-testid="input-chat-message"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending || limitReached}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
              data-testid="button-send-message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-white/5 rounded-lg px-3 py-2">
              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-blue-400" />
              <span>{t("concierge.messageInfo")}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-white/5 rounded-lg px-3 py-2">
              <CreditCard className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
              <span>{t("concierge.purchaseInfo")}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {t("concierge.disclaimer")}
            </p>
          </div>
        </div>

        {limitReached && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Message Limit Reached</h3>
                  <p className="text-sm text-muted-foreground">You've used all your AI messages this month</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Messages used</span>
                  <span className="text-white font-medium">{usageData?.messagesUsed || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monthly limit</span>
                  <span className="text-white font-medium">{usageData?.totalAvailable || 50}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/20 to-emerald-600/20 rounded-xl p-4 border border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <span className="font-bold text-white">Get 50 More Messages</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Continue chatting with your AI Concierge for just $4.99
                </p>
                <button
                  onClick={handleBuyMoreMessages}
                  disabled={isPurchasing}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPurchasing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Buy 50 Messages - $4.99
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setLimitReached(false)}
                className="w-full py-2 text-sm text-muted-foreground hover:text-white transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
