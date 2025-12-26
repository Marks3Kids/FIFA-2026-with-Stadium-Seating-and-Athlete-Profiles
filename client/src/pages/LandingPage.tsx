import { Globe, Shield, Clock, Plane, Hotel, Utensils, Heart, ChevronDown } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";
import { PricingSection } from "@/components/PricingSection";
import soccerBallIcon from "../assets/soccer-ball.svg";

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

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={soccerBallIcon} alt="Championship Concierge" className="w-12 h-12" />
            <div>
              <span className="text-lg font-display font-bold">
                <span className="text-primary">CHAMPIONSHIP</span>{" "}
                <span className="text-white">CONCIERGE</span>
              </span>
              <span className="text-xs text-muted-foreground block">2026</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/home" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Explore App
            </Link>
            <button
              onClick={scrollToPricing}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-8">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">June 11 - July 19, 2026</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className="text-white">Your Essential</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              2026 World Cup
            </span>
            <br />
            <span className="text-white">Travel Companion</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Navigate 16 host cities across USA, Canada & Mexico with confidence. 
            Everything you need for the biggest sporting event in history.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={scrollToPricing}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105"
            >
              Choose Your Plan
            </button>
            <Link
              href="/home"
              className="w-full sm:w-auto border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-white/5 transition-colors text-center"
            >
              Explore Features
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-muted-foreground">
            <div className="text-center">
              <span className="block text-3xl font-bold text-white">48</span>
              <span className="text-sm">Teams</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <span className="block text-3xl font-bold text-white">16</span>
              <span className="text-sm">Cities</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <span className="block text-3xl font-bold text-white">104</span>
              <span className="text-sm">Matches</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <span className="block text-3xl font-bold text-white">9</span>
              <span className="text-sm">Languages</span>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <button
              onClick={scrollToPricing}
              className="animate-bounce text-muted-foreground hover:text-white transition-colors"
            >
              <ChevronDown className="w-8 h-8" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From finding your way around host cities to staying safe and comfortable, 
              Championship Concierge has you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-background border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={pricingRef} className="py-20 px-4" id="pricing">
        <div className="max-w-6xl mx-auto">
          <PricingSection cancelUrl="/" />
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-bold">
                <span className="text-primary">CHAMPIONSHIP</span>{" "}
                <span className="text-white">CONCIERGE</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              This is an independent fan-made companion app and is not affiliated with, 
              endorsed by, or connected to FIFA or any official organizing bodies.
            </p>
            <div className="text-sm text-muted-foreground">
              &copy; 2026 Championship Concierge
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
