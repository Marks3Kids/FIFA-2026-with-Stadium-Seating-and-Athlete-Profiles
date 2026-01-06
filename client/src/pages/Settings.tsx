import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { 
  ArrowLeft, Bell, Globe, Moon, Volume2, Vibrate, 
  MapPin, Shield, Trash2, Check, ChevronRight, Navigation
} from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { LocationSettings } from "@/components/LocationSettings";

interface SettingsData {
  notifications: boolean;
  matchReminders: boolean;
  newsAlerts: boolean;
  language: string;
  darkMode: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  locationServices: boolean;
  dataSharing: boolean;
}

const DEFAULT_SETTINGS: SettingsData = {
  notifications: true,
  matchReminders: true,
  newsAlerts: true,
  language: "en",
  darkMode: true,
  soundEffects: true,
  hapticFeedback: true,
  locationServices: false,
  dataSharing: false,
};

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("wc2026_settings");
    if (savedSettings) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      } catch (e) {
        console.error("Failed to load settings");
      }
    }
  }, []);

  const handleToggle = (field: keyof SettingsData) => {
    const newSettings = { ...settings, [field]: !settings[field] };
    setSettings(newSettings);
    localStorage.setItem("wc2026_settings", JSON.stringify(newSettings));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleLanguageChange = (language: string) => {
    const newSettings = { ...settings, language };
    setSettings(newSettings);
    localStorage.setItem("wc2026_settings", JSON.stringify(newSettings));
    localStorage.setItem("wc2026_language", language);
    i18n.changeLanguage(language);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const clearAllData = () => {
    localStorage.removeItem("wc2026_profile");
    localStorage.removeItem("wc2026_settings");
    setSettings(DEFAULT_SETTINGS);
    setShowClearConfirm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        enabled ? "bg-primary" : "bg-white/20"
      }`}
      data-testid="toggle-switch"
    >
      <div
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );

  return (
    <Layout pageTitle="nav.settings">
      <div className="pt-12 px-6 pb-8">
        <Link href="/home" className="flex items-center text-muted-foreground mb-6" data-testid="back-to-menu">
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t("common.back")}
        </Link>

        <h1 className="text-3xl font-display font-bold text-white mb-8">{t("settings.title")}</h1>

        {saved && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top duration-300">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">{t("common.saved")}</span>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              {t("settings.notifications.title")}
            </h2>
            <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div>
                  <p className="text-white font-medium">{t("settings.notifications.pushNotifications")}</p>
                  <p className="text-sm text-muted-foreground">{t("settings.notifications.pushDescription")}</p>
                </div>
                <ToggleSwitch enabled={settings.notifications} onToggle={() => handleToggle("notifications")} />
              </div>
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div>
                  <p className="text-white font-medium">{t("settings.notifications.matchReminders")}</p>
                  <p className="text-sm text-muted-foreground">{t("settings.notifications.matchDescription")}</p>
                </div>
                <ToggleSwitch enabled={settings.matchReminders} onToggle={() => handleToggle("matchReminders")} />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-white font-medium">{t("settings.notifications.newsAlerts")}</p>
                  <p className="text-sm text-muted-foreground">{t("settings.notifications.newsDescription")}</p>
                </div>
                <ToggleSwitch enabled={settings.newsAlerts} onToggle={() => handleToggle("newsAlerts")} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-400" />
              {t("settings.languageRegion.title")}
            </h2>
            <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
              <div className="p-4">
                <p className="text-white font-medium mb-3">{t("settings.languageRegion.appLanguage")}</p>
                <div className="grid grid-cols-3 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings.language === lang.code
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10"
                      }`}
                      data-testid={`language-${lang.code}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-purple-400" />
              {t("settings.appearance.title")}
            </h2>
            <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-white font-medium">{t("settings.appearance.darkMode")}</p>
                    <p className="text-sm text-muted-foreground">{t("settings.appearance.darkModeDescription")}</p>
                  </div>
                </div>
                <ToggleSwitch enabled={settings.darkMode} onToggle={() => handleToggle("darkMode")} />
              </div>
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-white font-medium">{t("settings.appearance.soundEffects")}</p>
                    <p className="text-sm text-muted-foreground">{t("settings.appearance.soundDescription")}</p>
                  </div>
                </div>
                <ToggleSwitch enabled={settings.soundEffects} onToggle={() => handleToggle("soundEffects")} />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Vibrate className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-white font-medium">{t("settings.appearance.hapticFeedback")}</p>
                    <p className="text-sm text-muted-foreground">{t("settings.appearance.hapticDescription")}</p>
                  </div>
                </div>
                <ToggleSwitch enabled={settings.hapticFeedback} onToggle={() => handleToggle("hapticFeedback")} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              {t("settings.privacy.title")}
            </h2>
            <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-white font-medium">{t("settings.privacy.locationServices")}</p>
                    <p className="text-sm text-muted-foreground">{t("settings.privacy.locationDescription")}</p>
                  </div>
                </div>
                <ToggleSwitch enabled={settings.locationServices} onToggle={() => handleToggle("locationServices")} />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-white font-medium">{t("settings.privacy.analytics")}</p>
                    <p className="text-sm text-muted-foreground">{t("settings.privacy.analyticsDescription")}</p>
                  </div>
                </div>
                <ToggleSwitch enabled={settings.dataSharing} onToggle={() => handleToggle("dataSharing")} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-cyan-400" />
              {t("location.currentCity")}
            </h2>
            <LocationSettings />
          </div>

          <div>
            <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              {t("settings.dataManagement.title")}
            </h2>
            <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                  data-testid="button-clear-data"
                >
                  <div>
                    <p className="text-red-400 font-medium">{t("settings.dataManagement.clearAllData")}</p>
                    <p className="text-sm text-muted-foreground">{t("settings.dataManagement.clearDescription")}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ) : (
                <div className="p-4">
                  <p className="text-white font-medium mb-2">{t("settings.dataManagement.confirmClear")}</p>
                  <p className="text-sm text-muted-foreground mb-4">{t("settings.dataManagement.confirmClearMessage")}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 py-2 px-4 rounded-lg bg-white/10 text-white font-medium"
                      data-testid="button-cancel-clear"
                    >
                      {t("common.cancel")}
                    </button>
                    <button
                      onClick={clearAllData}
                      className="flex-1 py-2 px-4 rounded-lg bg-red-500 text-white font-medium"
                      data-testid="button-confirm-clear"
                    >
                      {t("settings.dataManagement.clearData")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-muted-foreground text-sm">{t("settings.appInfo")}</p>
            <p className="text-muted-foreground text-xs mt-1">{t("settings.version")}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
