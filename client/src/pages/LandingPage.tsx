import { Globe, Shield, Clock, Plane, Hotel, Utensils, Heart, ChevronDown, Tag } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";
import { PricingSection } from "@/components/PricingSection";
import { useSubscription } from "@/contexts/SubscriptionContext";
import soccerBallIcon from "../assets/soccer-ball.svg";
import { useTranslation } from "react-i18next";

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
  const { tier } = useSubscription();
  const { i18n } = useTranslation();
  const isSubscribed = tier !== "free" && tier !== null && tier !== undefined;

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-background">
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language selector */}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              defaultValue={i18n.language}
              className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-1.5 sm:px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="en">🇺🇸 EN</option>
              <option value="es">🇪🇸 ES</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="de">🇩🇪 DE</option>
              <option value="pt">🇧🇷 PT</option>
              <option value="ar">🇸🇦 AR</option>
              <option value="ja">🇯🇵 JA</option>
              <option value="nl">🇳🇱 NL</option>
              <option value="it">🇮🇹 IT</option>
            </select>
            {isSubscribed ? (
              <Link
                href="/home"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors"
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
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with stadium atmosphere */}
      <section
        className="relative pt-28 pb-20 px-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #050a05 0%, #0a1a0a 30%, #0d1f0d 50%, #071507 70%, #030903 100%)",
        }}
      >
        {/* Stadium lighting glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-primary/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-48 bg-primary/5 rounded-full blur-3xl" />
          {/* Pitch lines suggestion */}
          <div className="absolute bottom-0 left-0 right-0 h-32"
            style={{
              background: "linear-gradient(to top, rgba(34,197,94,0.06) 0%, transparent 100%)"
            }}
          />
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(34,197,94,0.03) 120px, rgba(34,197,94,0.03) 121px)",
            }}
          />
        </div>

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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
            {isSubscribed ? (
              <Link
                href="/home"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                Go to My Content
              </Link>
            ) : (
              <>
                <button
                  onClick={scrollToPricing}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                >
                  Choose Your Plan
                </button>
                <Link
                  href="/home"
                  className="w-full sm:w-auto border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-white/5 transition-colors text-center"
                >
                  Explore Features
                </Link>
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
