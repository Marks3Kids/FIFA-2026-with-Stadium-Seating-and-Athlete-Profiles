import { Globe, Shield, Clock, Plane, Hotel, Utensils, Heart, ChevronDown, Tag, Menu, X, RefreshCw, Loader2, CheckCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { PricingSection } from "@/components/PricingSection";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { apiUrl } from "@/lib/apiConfig";
import soccerBallIcon from "../assets/soccer-ball.svg";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", flag: "🇺🇸", label: "EN" },
  { code: "es", flag: "🇪🇸", label: "ES" },
  { code: "fr", flag: "🇫🇷", label: "FR" },
  { code: "de", flag: "🇩🇪", label: "DE" },
  { code: "pt", flag: "🇧🇷", label: "PT" },
  { code: "ar", flag: "🇸🇦", label: "AR" },
  { code: "ja", flag: "🇯🇵", label: "JA" },
  { code: "nl", flag: "🇳🇱", label: "NL" },
  { code: "it", flag: "🇮🇹", label: "IT" },
];

const FEATURES = [
  { icon: <Globe className="w-8 h-8" />, title: "16 Host Cities", description: "Comprehensive guides for every venue across USA, Canada & Mexico" },
  { icon: <Shield className="w-8 h-8" />, title: "Safety First", description: "Emergency contacts, medical facilities, and safety tips" },
  { icon: <Plane className="w-8 h-8" />, title: "Transportation", description: "Flights, trains, buses, and car rentals all in one place" },
  { icon: <Hotel className="w-8 h-8" />, title: "Lodging", description: "Find the perfect place to stay near your matches" },
  { icon: <Utensils className="w-8 h-8" />, title: "Dining", description: "Restaurant recommendations for every taste and budget" },
  { icon: <Heart className="w-8 h-8" />, title: "Religious Services", description: "Churches, mosques, and synagogues in all host cities" },
];

export default function LandingPage() {
  const pricingRef = useRef<HTMLDivElement>(null);
  const { subscriptionTier, isLoading, setSubscription } = useSubscription();
  const { i18n } = useTranslation();
  const [, navigate] = useLocation();
  const isSubscribed = subscriptionTier === 'team_info' || subscriptionTier === 'logistics' || subscriptionTier === 'ai_concierge';
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Inline Restore modal state
  const [showRestore, setShowRestore] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState("");

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  // Auto-redirect when subscriptionTier becomes paid (after restore or initial load)
  useEffect(() => {
    if (!isLoading && isSubscribed) {
      console.log(`[LandingPage] Paid tier detected (${subscriptionTier}) — navigating to /home`);
      navigate('/home', { replace: true } as any);
    }
  }, [isLoading, isSubscribed, subscriptionTier]);

  const scrollToPricing = () => {
    setMenuOpen(false);
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = restoreEmail.trim().toLowerCase();
    if (!email) return;
    setIsRestoring(true);
    setRestoreError("");
    try {
      const res = await fetch(apiUrl(`/api/subscription/verify?email=${encodeURIComponent(email)}&t=${Date.now()}`));
      const data = await res.json();
      console.log(`[LandingPage] Restore verify — email=${email} valid=${data.valid} tier=${data.tier}`);
      if (data.valid && data.tier && data.tier !== 'free') {
        setSubscription(email, data.tier as SubscriptionTier);
        // GlobalRedirect + useEffect above will fire immediately
      } else {
        setRestoreError("No paid purchase found for this email. Please check and try again, or contact support@championshipconcierge.com");
      }
    } catch {
      setRestoreError("Connection error. Please check your internet and try again.");
    } finally {
      setIsRestoring(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Restore Purchase Modal ──────────────────────────────────── */}
      {showRestore && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 rounded-2xl p-7 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Restore Your Access</h3>
              <button onClick={() => { setShowRestore(false); setRestoreError(""); }} className="text-muted-foreground hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Enter the email you used when you purchased. We'll look it up and unlock your content immediately.
            </p>
            <form onSubmit={handleRestore} className="space-y-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={restoreEmail}
                onChange={e => setRestoreEmail(e.target.value)}
                autoFocus
                className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
              />
              {restoreError && (
                <p className="text-red-400 text-xs leading-relaxed">{restoreError}</p>
              )}
              <button
                type="submit"
                disabled={isRestoring || !restoreEmail.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRestoring ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking…</> : <><CheckCircle className="w-4 h-4" /> Restore Access</>}
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Problems? Email <a href="mailto:support@championshipconcierge.com" className="text-primary">support@championshipconcierge.com</a>
            </p>
          </div>
        </div>
      )}

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={soccerBallIcon} alt="Championship Concierge" className="w-8 h-8 sm:w-10 sm:h-10" />
            <div>
              <span className="text-sm sm:text-base font-display font-bold leading-tight">
                <span className="text-primary">CHAMPIONSHIP</span>{" "}
                <span className="text-white">CONCIERGE</span>
              </span>
              <span className="text-xs text-muted-foreground block">2026</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Restore button — always visible in header on ALL screen sizes */}
            {!isSubscribed && (
              <button
                onClick={() => setShowRestore(true)}
                className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 text-xs font-semibold rounded-lg px-2.5 py-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Restore</span>
                <span className="xs:hidden">↻</span>
              </button>
            )}

            {/* Language selector — always visible */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => { setLangOpen(o => !o); setMenuOpen(false); }}
                className="flex items-center gap-1 bg-white/10 border border-white/20 text-white text-xs rounded-lg px-2 py-1.5 hover:bg-white/20 transition-colors"
              >
                <span>{currentLang.flag}</span>
                <span className="font-medium">{currentLang.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-[#1a2a1a] border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[90px]">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-primary/20 transition-colors text-left ${lang.code === i18n.language ? "text-primary font-bold bg-primary/10" : "text-white"}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop-only buttons */}
            {isSubscribed ? (
              <Link
                href="/home"
                className="hidden sm:block bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                My Content
              </Link>
            ) : (
              <>
                <Link href="/home" className="hidden sm:block text-sm text-muted-foreground hover:text-white transition-colors">
                  Explore App
                </Link>
                <button
                  onClick={scrollToPricing}
                  className="hidden sm:block bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Get Started
                </button>
              </>
            )}

            {/* Mobile-only hamburger menu */}
            <div ref={menuRef} className="relative sm:hidden">
              <button
                onClick={() => { setMenuOpen(o => !o); setLangOpen(false); }}
                className="flex items-center justify-center w-9 h-9 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-[#1a2a1a] border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[220px]">
                  {isSubscribed ? (
                    <Link
                      href="/home"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
                    >
                      <span>⚽</span> My Content
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={scrollToPricing}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-primary hover:bg-primary/10 transition-colors text-left"
                      >
                        <Tag className="w-4 h-4" /> Get Started
                      </button>
                      <Link
                        href="/home"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors border-t border-white/10"
                      >
                        <Globe className="w-4 h-4" /> Explore App
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/pricing?restore=1"); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-emerald-400 hover:bg-white/5 transition-colors border-t border-white/10 text-left"
                  >
                    <RefreshCw className="w-4 h-4" /> Already purchased? Restore
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Returning Customer Banner ───────────────────────────────────────── */}
      {!isSubscribed && (
        <div className="pt-16 bg-background">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 border-b border-emerald-500/20 bg-emerald-500/5">
            <p className="text-xs sm:text-sm text-emerald-300 font-medium leading-tight">
              <span className="font-bold text-emerald-400">Already purchased?</span>{" "}
              <span className="hidden sm:inline">Your access is saved to your email — restore it in seconds.</span>
              <span className="sm:hidden">Restore your access instantly.</span>
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowRestore(true)}
                className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/60 text-emerald-400 text-xs font-bold rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
              >
                <RefreshCw className="w-3 h-3" />
                Restore Access
              </button>
              <a
                href="/restore-access"
                className="text-xs text-emerald-500/70 hover:text-emerald-400 underline underline-offset-2 transition-colors whitespace-nowrap hidden sm:inline"
              >
                Can't load the app?
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with stadium photo */}
      <section
        className={`relative ${!isSubscribed ? "pt-8" : "pt-28"} pb-20 px-4 overflow-hidden`}
        style={{
          backgroundImage: "url('/stadium-hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.72) 100%)" }} />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* One-Time Purchase Badge */}
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-4 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
            <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">ONE-TIME PURCHASE — Starting at just $1.99</span>
          </div>

          {/* Date badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm text-primary font-medium">June 11 – July 19, 2026</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            <span className="text-white">YOUR ESSENTIAL</span>
            <br />
            <span className="text-primary">2026 CHAMPIONSHIP</span>
            <br />
            <span className="text-amber-400">TRAVEL COMPANION</span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-3 px-2">
            Navigate 16 host cities across USA, Canada &amp; Mexico with confidence.
            Everything you need for the biggest sporting event in history.
          </p>

          <p className="text-sm sm:text-base font-semibold text-primary mb-8 sm:mb-10">
            No subscription. No recurring charges. Pay once, use all tournament long.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 mb-10 sm:mb-12 w-full max-w-md mx-auto">
            {isSubscribed ? (
              <Link
                href="/home"
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                Open My Full App
              </Link>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={scrollToPricing}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                  >
                    Choose Your Plan
                  </button>
                  <Link
                    href="/home"
                    className="flex-1 border border-white/20 text-white px-6 py-4 rounded-xl text-base font-medium hover:bg-white/5 transition-colors text-center"
                  >
                    Explore Features
                  </Link>
                </div>
                {/* Always-visible Restore button — critical for returning paid users */}
                <button
                  onClick={() => setShowRestore(true)}
                  className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-emerald-500/40 hover:border-emerald-500/80 text-emerald-400 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Already Purchased? Restore Access
                </button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-muted-foreground">
            {[
              { value: "48", label: "Teams" },
              { value: "16", label: "Cities" },
              { value: "104", label: "Matches" },
              { value: "9", label: "Languages" },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-center gap-4 sm:gap-8">
                <div className="text-center">
                  <span className="block text-2xl sm:text-3xl font-bold text-white">{stat.value}</span>
                  <span className="text-xs sm:text-sm">{stat.label}</span>
                </div>
                {i < arr.length - 1 && <div className="w-px h-10 sm:h-12 bg-white/10" />}
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 flex justify-center">
            <button
              onClick={scrollToPricing}
              className="animate-bounce text-muted-foreground hover:text-white transition-colors"
            >
              <ChevronDown className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-16 sm:py-20 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              From finding your way around host cities to staying safe and comfortable,
              Championship Concierge has you covered.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-background border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section ref={pricingRef} className="py-16 sm:py-20 px-4" id="pricing">
        <div className="max-w-6xl mx-auto">
          <PricingSection cancelUrl="/" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img src={soccerBallIcon} alt="Championship Concierge" className="w-8 h-8" />
                <span className="font-display font-bold text-sm">
                  <span className="text-primary">Championship</span>{" "}
                  <span className="text-white">Concierge</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your AI-powered travel companion for the 2026 international soccer championship.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/home" className="hover:text-white transition-colors">Explore App</Link></li>
                <li><Link href="/cities" className="hover:text-white transition-colors">Cities</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Download</h4>
              <a
                href="https://play.google.com/store/apps/details?id=com.mingledtreasure.championshipconcierge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76a2 2 0 001.07-.32l.1-.06 11.37-6.57-2.48-2.49-10.06 9.44zM.6 1.18A2 2 0 000 2.6v18.8a2 2 0 00.6 1.42l.08.07 10.53-10.53v-.25L.68 1.11l-.08.07zM20.6 10.37l-3.22-1.86-2.79 2.79 2.79 2.79 3.24-1.87a2 2 0 000-3.85zM4.25.56L15.62 7.12l-2.48 2.49L3.08.17A2 2 0 014.25.56z"/>
                </svg>
                <span className="text-xs font-medium">Google Play</span>
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 sm:pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              © 2026 Championship Concierge · Independent fan-made app · Not affiliated with FIFA or any official organizing body.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
