import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ArrowLeft, User, Mail, Phone, MapPin, Flag, Calendar, Camera, Check } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

interface ProfileData {
  displayName: string;
  email: string;
  phone: string;
  homeCity: string;
  nationality: string;
  favoriteTeam: string;
  arrivalDate: string;
  departureDate: string;
}

const DEFAULT_PROFILE: ProfileData = {
  displayName: "",
  email: "",
  phone: "",
  homeCity: "",
  nationality: "",
  favoriteTeam: "",
  arrivalDate: "",
  departureDate: "",
};

const FAVORITE_TEAMS = [
  "Argentina", "Australia", "Belgium", "Brazil", "Cameroon", "Canada",
  "Colombia", "Costa Rica", "Croatia", "Denmark", "Ecuador", "England",
  "France", "Germany", "Ghana", "Iran", "Japan", "Mexico", "Morocco",
  "Netherlands", "Nigeria", "Peru", "Poland", "Portugal", "Qatar",
  "Saudi Arabia", "Senegal", "Serbia", "South Korea", "Spain", "Switzerland",
  "Tunisia", "Uruguay", "USA", "Wales", "Other"
];

export default function Profile() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("wc2026_profile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to load profile");
      }
    }
  }, []);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("wc2026_profile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout pageTitle="nav.signIn">
      <div className="pt-12 px-6 pb-8">
        <Link href="/home" className="flex items-center text-muted-foreground mb-6" data-testid="back-to-menu">
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t("common.back")}
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center relative">
            <User className="w-10 h-10 text-white" />
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border border-white/10 flex items-center justify-center">
              <Camera className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              {profile.displayName || t("menu.defaultUserName")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("profile.attendeeTitle")}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {t("profile.personalInfo")}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("profile.displayName")}</label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => handleChange("displayName", e.target.value)}
                  placeholder={t("profile.displayNamePlaceholder")}
                  className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  data-testid="input-display-name"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t("profile.email")}
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder={t("profile.emailPlaceholder")}
                  className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  data-testid="input-email"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t("profile.phone")}
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder={t("profile.phonePlaceholder")}
                  className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  data-testid="input-phone"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t("profile.homeCity")}
                </label>
                <input
                  type="text"
                  value={profile.homeCity}
                  onChange={(e) => handleChange("homeCity", e.target.value)}
                  placeholder={t("profile.homeCityPlaceholder")}
                  className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  data-testid="input-home-city"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  {t("profile.nationality")}
                </label>
                <input
                  type="text"
                  value={profile.nationality}
                  onChange={(e) => handleChange("nationality", e.target.value)}
                  placeholder={t("profile.nationalityPlaceholder")}
                  className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  data-testid="input-nationality"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-yellow-400" />
              {t("profile.worldCupPrefs")}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("profile.favoriteTeam")}</label>
                <select
                  value={profile.favoriteTeam}
                  onChange={(e) => handleChange("favoriteTeam", e.target.value)}
                  className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none"
                  data-testid="select-favorite-team"
                >
                  <option value="" className="bg-card">{t("profile.selectTeam")}</option>
                  {FAVORITE_TEAMS.map((team) => (
                    <option key={team} value={team} className="bg-card">{team}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t("profile.arrivalDate")}
                  </label>
                  <input
                    type="date"
                    value={profile.arrivalDate}
                    onChange={(e) => handleChange("arrivalDate", e.target.value)}
                    className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    data-testid="input-arrival-date"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t("profile.departureDate")}
                  </label>
                  <input
                    type="date"
                    value={profile.departureDate}
                    onChange={(e) => handleChange("departureDate", e.target.value)}
                    className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    data-testid="input-departure-date"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              saved 
                ? "bg-green-500 text-white" 
                : "bg-primary text-primary-foreground active:scale-98"
            }`}
            data-testid="button-save-profile"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                {t("common.saved")}
              </>
            ) : (
              t("profile.saveProfile")
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            {t("profile.savedLocally")}
          </p>
        </div>
      </div>
    </Layout>
  );
}
