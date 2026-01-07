import { Layout } from "@/components/Layout";
import { useTranslation } from "react-i18next";
import { Scale, FileText, Shield, RefreshCw, Database, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

type LegalSection = "terms" | "privacy" | "refund" | "all";

export function Legal() {
  const { t } = useTranslation();
  const [location] = useLocation();
  
  const getSection = (): LegalSection => {
    if (location === "/terms") return "terms";
    if (location === "/privacy") return "privacy";
    if (location === "/refund") return "refund";
    return "all";
  };
  
  const section = getSection();

  const renderTerms = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">{t("legal.termsTitle")}</h2>
      </div>
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>{t("legal.termsAcceptance")}</p>
        <p>{t("legal.intellectualProperty")}</p>
        <p>{t("legal.liabilityLimitation")}</p>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">{t("legal.privacyTitle")}</h2>
      </div>
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>{t("legal.privacyStatement")}</p>
        
        <div className="pt-4 border-t border-white/5">
          <h3 className="text-white font-semibold mb-2">{t("legal.dataRetentionTitle")}</h3>
          <p>{t("legal.dataRetention")}</p>
        </div>
      </div>
    </div>
  );

  const renderRefund = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">{t("legal.refundTitle")}</h2>
      </div>
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>{t("legal.refundPolicy")}</p>
      </div>
    </div>
  );

  const renderDisclaimer = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">{t("legal.title")}</h2>
      </div>
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>{t("legal.disclaimer")}</p>
        <p>{t("legal.noAffiliation")}</p>
        <p>{t("legal.informationalPurposes")}</p>
        <p>{t("legal.thirdPartyLinks")}</p>
        <p>{t("legal.accuracyDisclaimer")}</p>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (section) {
      case "terms": return t("legal.termsTitle");
      case "privacy": return t("legal.privacyTitle");
      case "refund": return t("legal.refundTitle");
      default: return t("legal.title");
    }
  };

  return (
    <Layout hideTitle>
      <div className="px-4 py-6 space-y-6 pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </Link>

        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{getTitle()}</h1>
          <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
        </div>

        {section === "all" && (
          <div className="space-y-6">
            {renderDisclaimer()}
            {renderTerms()}
            {renderRefund()}
            {renderPrivacy()}
          </div>
        )}

        {section === "terms" && (
          <div className="space-y-6">
            {renderTerms()}
            {renderDisclaimer()}
          </div>
        )}

        {section === "privacy" && (
          <div className="space-y-6">
            {renderPrivacy()}
          </div>
        )}

        {section === "refund" && (
          <div className="space-y-6">
            {renderRefund()}
          </div>
        )}

        <div className="text-center pt-6 border-t border-white/5">
          <p className="text-xs text-muted-foreground">
            {t("legal.copyright")}
          </p>
          
          {section !== "all" && (
            <div className="flex justify-center gap-4 mt-4 text-xs">
              {section !== "terms" && (
                <Link href="/terms" className="text-primary hover:underline">
                  {t("legal.termsTitle")}
                </Link>
              )}
              {section !== "privacy" && (
                <Link href="/privacy" className="text-primary hover:underline">
                  {t("legal.privacyTitle")}
                </Link>
              )}
              {section !== "refund" && (
                <Link href="/refund" className="text-primary hover:underline">
                  {t("legal.refundTitle")}
                </Link>
              )}
              <Link href="/legal" className="text-primary hover:underline">
                All Legal
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
