import { Layout } from "@/components/Layout";
import { Church, Cross, Moon, ExternalLink, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { religiousServices } from "@/data/religiousServices";
import { getFlagUrl } from "@/lib/flags";

export default function ReligiousServices() {
  const { t } = useTranslation();

  const countryFlags: Record<string, string> = {
    usa: getFlagUrl("United States"),
    canada: getFlagUrl("Canada"),
    mexico: getFlagUrl("Mexico")
  };

  const groupedByCountry = {
    usa: religiousServices.filter(s => s.countryKey === "usa"),
    canada: religiousServices.filter(s => s.countryKey === "canada"),
    mexico: religiousServices.filter(s => s.countryKey === "mexico")
  };

  const renderServiceCard = (
    cityKey: string,
    religion: "protestant" | "catholic" | "islamic",
    mapUrl: string
  ) => {
    const icons = {
      protestant: Church,
      catholic: Cross,
      islamic: Moon
    };
    const colors = {
      protestant: "text-blue-400 bg-blue-400/10 border-blue-400/20",
      catholic: "text-purple-400 bg-purple-400/10 border-purple-400/20",
      islamic: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
    };
    const Icon = icons[religion];

    return (
      <a
        key={`${cityKey}-${religion}`}
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 p-3 rounded-lg border ${colors[religion]} hover:opacity-80 transition-opacity`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-white text-sm font-medium flex-1">
          {t(`religiousServices.${religion}`)}
        </span>
        <ExternalLink className="w-4 h-4 text-muted-foreground" />
      </a>
    );
  };

  const renderCitySection = (service: typeof religiousServices[0]) => (
    <div key={service.cityKey} className="bg-card border border-white/10 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-display font-bold text-white">
          {t(`cities.cityNames.${service.cityKey}`)}
        </h3>
      </div>
      <div className="space-y-2">
        {renderServiceCard(service.cityKey, "protestant", service.protestantMapUrl)}
        {renderServiceCard(service.cityKey, "catholic", service.catholicMapUrl)}
        {renderServiceCard(service.cityKey, "islamic", service.islamicMapUrl)}
      </div>
    </div>
  );

  const renderCountrySection = (countryKey: string, cities: typeof religiousServices) => (
    <div key={countryKey} className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <img 
          src={countryFlags[countryKey]} 
          alt={t(`cities.countries.${countryKey}`)} 
          className="w-8 h-6 object-cover rounded"
        />
        <h2 className="text-xl font-display font-bold text-white">
          {t(`cities.countries.${countryKey}`)}
        </h2>
      </div>
      {cities.map(renderCitySection)}
    </div>
  );

  return (
    <Layout pageTitle="religiousServices.title">
      <div className="pt-12 px-4 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {t("religiousServices.title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("religiousServices.subtitle")}
          </p>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground">
            {t("religiousServices.disclaimer")}
          </p>
        </div>

        {renderCountrySection("usa", groupedByCountry.usa)}
        {renderCountrySection("canada", groupedByCountry.canada)}
        {renderCountrySection("mexico", groupedByCountry.mexico)}
      </div>
    </Layout>
  );
}
