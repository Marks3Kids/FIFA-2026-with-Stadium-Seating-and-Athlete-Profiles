import { Layout } from "@/components/Layout";
import { Plane, Train, Bus, Car, MapPin, Clock, DollarSign, Info, AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import transportHero from "@assets/generated_images/multi-modal_transportation_travel_scene.png";

interface TransportMode {
  icon: typeof Plane;
  titleKey: string;
  descriptionKey: string;
  detailsKey: string;
  link?: string;
}

export default function Transportation() {
  const { t } = useTranslation();
  
  const transportModes: TransportMode[] = [
    {
      icon: Plane,
      titleKey: "transportation.modes.internationalFlights.title",
      descriptionKey: "transportation.modes.internationalFlights.description",
      detailsKey: "transportation.modes.internationalFlights.details",
      link: "/transportation/international-flights"
    },
    {
      icon: Plane,
      titleKey: "transportation.modes.domesticFlights.title",
      descriptionKey: "transportation.modes.domesticFlights.description",
      detailsKey: "transportation.modes.domesticFlights.details",
      link: "/transportation/domestic-flights"
    },
    {
      icon: Train,
      titleKey: "transportation.modes.railServices.title",
      descriptionKey: "transportation.modes.railServices.description",
      detailsKey: "transportation.modes.railServices.details",
      link: "/transportation/rail-services"
    },
    {
      icon: Bus,
      titleKey: "transportation.modes.busServices.title",
      descriptionKey: "transportation.modes.busServices.description",
      detailsKey: "transportation.modes.busServices.details",
      link: "/transportation/bus-services"
    },
    {
      icon: Car,
      titleKey: "transportation.modes.carRentals.title",
      descriptionKey: "transportation.modes.carRentals.description",
      detailsKey: "transportation.modes.carRentals.details",
      link: "/transportation/car-rentals"
    }
  ];

  const travelTips = [
    {
      icon: Clock,
      titleKey: "transportation.tips.planAhead.title",
      tipKey: "transportation.tips.planAhead.tip"
    },
    {
      icon: DollarSign,
      titleKey: "transportation.tips.budgetWisely.title",
      tipKey: "transportation.tips.budgetWisely.tip"
    },
    {
      icon: MapPin,
      titleKey: "transportation.tips.knowYourVenue.title",
      tipKey: "transportation.tips.knowYourVenue.tip"
    },
    {
      icon: Info,
      titleKey: "transportation.tips.stayInformed.title",
      tipKey: "transportation.tips.stayInformed.tip"
    }
  ];

  const TransportCard = ({ mode, index }: { mode: TransportMode; index: number }) => {
    const details = t(mode.detailsKey, { returnObjects: true }) as string[];
    const content = (
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <mode.icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white mb-1">{t(mode.titleKey)}</h3>
            {mode.link && <ChevronRight className="w-5 h-5 text-primary" />}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{t(mode.descriptionKey)}</p>
          <ul className="space-y-1.5">
            {Array.isArray(details) && details.map((detail, i) => (
              <li key={i} className="text-sm text-gray-400 flex items-start">
                <span className="text-primary mr-2">•</span>
                {detail}
              </li>
            ))}
          </ul>
          {mode.link && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <span className="text-sm text-primary font-medium">{t("common.viewDetails")}</span>
            </div>
          )}
        </div>
      </div>
    );

    if (mode.link) {
      return (
        <Link 
          href={mode.link}
          className="block bg-card border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-colors cursor-pointer"
          data-testid={`card-transport-${index}`}
        >
          {content}
        </Link>
      );
    }

    return (
      <div 
        className="bg-card border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-colors"
        data-testid={`card-transport-${index}`}
      >
        {content}
      </div>
    );
  };

  return (
    <Layout pageTitle="nav.transportation">
      {/* Hero Section */}
      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background z-10" />
        <img 
          src={transportHero} 
          alt="Transportation - Planes, Trains, Buses, Cars" 
          className="w-full h-64 object-cover"
          data-testid="img-transport-hero"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white drop-shadow-2xl" data-testid="text-page-title">
            {t("transportation.title")}
          </h1>
        </div>
      </div>

      {/* Intro Section */}
      <div className="px-6 py-6">
        <p className="text-gray-300 leading-relaxed" data-testid="text-intro">
          {t("transportation.intro")}
        </p>
      </div>

      {/* Transportation Modes */}
      <div className="px-6 pb-6">
        <h2 className="text-2xl font-display font-bold text-white mb-4" data-testid="text-section-modes">
          {t("transportation.options")}
        </h2>
        <div className="space-y-4">
          {transportModes.map((mode, index) => (
            <TransportCard key={index} mode={mode} index={index} />
          ))}
        </div>
      </div>

      {/* Travel Tips */}
      <div className="px-6 pb-6">
        <h2 className="text-2xl font-display font-bold text-white mb-4" data-testid="text-section-tips">
          {t("transportation.travelTips")}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {travelTips.map((tip, index) => (
            <div 
              key={index}
              className="bg-card border border-white/5 rounded-xl p-4"
              data-testid={`card-tip-${index}`}
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <tip.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{t(tip.titleKey)}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{t(tip.tipKey)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-6 pb-24">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4" data-testid="card-disclaimer">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-500 mb-2">{t("transportation.disclaimer")}</h3>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                {t("transportation.disclaimerText")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
