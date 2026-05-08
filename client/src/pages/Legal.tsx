import { Layout } from "@/components/Layout";
import { Scale, FileText, Shield, RefreshCw, ArrowLeft, Building, Mail, Clock } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";

type LegalSection = "terms" | "privacy" | "refund" | "all";

export function Legal() {
  const [location] = useLocation();
  const { t } = useTranslation();

  const getSection = (): LegalSection => {
    if (location === "/terms") return "terms";
    if (location === "/privacy") return "privacy";
    if (location === "/refund") return "refund";
    if (location === "/policy") return "refund";
    return "all";
  };

  const section = getSection();

  const arr = (key: string): string[] => {
    const value = t(key, { returnObjects: true });
    return Array.isArray(value) ? (value as string[]) : [];
  };

  const renderTerms = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">{t("legal.title.terms")}</h2>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>{t("legal.lastUpdatedShort")}</p>
        <p>{t("legal.effectiveDate")}</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>{t("legal.terms.intro")}</p>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.terms.s1Title")}</h3>
          <p>{t("legal.terms.s1Body")}</p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.terms.s2Title")}</h3>
          <p className="mb-3">{t("legal.terms.s2Body")}</p>
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-3">
            <p className="text-white font-medium">{t("legal.terms.s2IncludesLabel")}</p>
            <ul className="list-disc list-inside space-y-2">
              {arr("legal.terms.s2Includes").map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.terms.s3Title")}</h3>
          <ul className="list-disc list-inside space-y-1">
            {arr("legal.terms.s3Items").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.terms.s4Title")}</h3>
          <p className="text-white font-medium mb-2">{t("legal.terms.s4SecurityLabel")}</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            {arr("legal.terms.s4Security").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="text-white font-medium mb-2">{t("legal.terms.s4TerminationLabel")}</p>
          <ul className="list-disc list-inside space-y-1">
            {arr("legal.terms.s4Termination").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.terms.s5Title")}</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg mb-4">
            <p className="text-white font-medium mb-2">{t("legal.terms.s5TierLabel")}</p>
            <ul className="list-disc list-inside space-y-1">
              {arr("legal.terms.s5Tiers").map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="text-white font-medium mb-2">{t("legal.terms.s5PaymentLabel")}</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            {arr("legal.terms.s5Payment").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="text-white font-medium mb-2">{t("legal.terms.s5PeriodLabel")}</p>
          <p>{t("legal.terms.s5Period")}</p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.terms.s6Title")}</h3>
          <p className="mb-3">{t("legal.terms.s6Intro")}</p>
          <p className="text-white font-medium mb-2">{t("legal.terms.s6UsageLabel")}</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            {arr("legal.terms.s6Usage").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
            <p className="text-amber-400 font-medium mb-2">{t("legal.terms.s6DisclaimerLabel")}</p>
            <ul className="list-disc list-inside space-y-1 text-amber-200/80">
              {arr("legal.terms.s6Disclaimer").map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.terms.s7Title")}</h3>
          <p className="mb-3">{t("legal.terms.s7Body1")}</p>
          <p>{t("legal.terms.s7Body2")}</p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.terms.s8Title")}</h3>
          <p>{t("legal.terms.s8Body")}</p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.terms.s9Title")}</h3>
          <p className="text-white font-medium mb-2">{t("legal.terms.s9LawLabel")}</p>
          <p className="mb-4">{t("legal.terms.s9Law")}</p>
          <p className="text-white font-medium mb-2">{t("legal.terms.s9InformalLabel")}</p>
          <p className="mb-4">{t("legal.terms.s9Informal")}</p>
          <p className="text-white font-medium mb-2">{t("legal.terms.s9ArbLabel")}</p>
          <p className="mb-2">{t("legal.terms.s9ArbIntro")}</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            {arr("legal.terms.s9ArbItems").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="text-white font-medium mb-2">{t("legal.terms.s9OptOutLabel")}</p>
          <p>{t("legal.terms.s9OptOut")}</p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.terms.s10Title")}</h3>
          <ul className="list-disc list-inside space-y-1">
            {arr("legal.terms.s10Items").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">{t("legal.title.privacy")}</h2>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>{t("legal.lastUpdatedShort")}</p>
        <p>{t("legal.effectiveDate")}</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>{t("legal.privacy.intro")}</p>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.privacy.s1Title")}</h3>
          <p className="text-white font-medium mb-2">{t("legal.privacy.s1Label")}</p>
          <ul className="list-disc list-inside space-y-1">
            {arr("legal.privacy.s1Items").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.privacy.s2Title")}</h3>
          <ul className="list-disc list-inside space-y-1">
            {arr("legal.privacy.s2Items").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.privacy.s3Title")}</h3>
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-1 text-emerald-200/80">
              {arr("legal.privacy.s3Items").map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.privacy.s4Title")}</h3>
          <ul className="list-disc list-inside space-y-1">
            {arr("legal.privacy.s4Items").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.privacy.s5Title")}</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-1">
              {arr("legal.privacy.s5Items").map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.privacy.s6Title")}</h3>
          <ul className="list-disc list-inside space-y-1">
            {arr("legal.privacy.s6Items").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.privacy.s7Title")}</h3>
          <p className="mb-2">{t("legal.privacy.s7Intro")}</p>
          <ul className="list-disc list-inside space-y-1">
            {arr("legal.privacy.s7Items").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.privacy.s8Title")}</h3>
          <p>
            {t("legal.privacy.s8Body")}{" "}
            <a href="mailto:support@championshipconcierge.com" className="text-primary hover:underline ml-1">
              support@championshipconcierge.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  const renderRefund = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">{t("legal.title.refund")}</h2>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>{t("legal.lastUpdatedShort")}</p>
        <p>{t("legal.effectiveDate")}</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>{t("legal.refund.intro")}</p>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.refund.s1Title")}</h3>
          <p className="mb-2">{t("legal.refund.s1Body")}</p>
          <ul className="list-disc list-inside space-y-1">
            {arr("legal.refund.s1Items").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.refund.s2Title")}</h3>
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-1 text-red-200/80">
              {arr("legal.refund.s2Items").map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.refund.s3Title")}</h3>
          <ol className="list-decimal list-inside space-y-2">
            {arr("legal.refund.s3Items").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.refund.s4Title")}</h3>
          <ul className="list-disc list-inside space-y-1">
            {arr("legal.refund.s4Items").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{t("legal.refund.s5Title")}</h3>
          <p>{t("legal.refund.s5Body")}</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-white font-medium mb-2">{t("legal.refund.questions")}</p>
          <p>
            {t("legal.refund.contactUs")}{" "}
            <a href="mailto:support@championshipconcierge.com" className="text-primary hover:underline">
              support@championshipconcierge.com
            </a>
          </p>
          <p className="text-xs mt-2">{t("legal.refund.responseTime")}</p>
        </div>
      </div>
    </div>
  );

  const renderDisclaimer = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">{t("legal.title.disclaimer")}</h2>
      </div>

      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
          <p className="text-amber-200">
            <span className="font-bold">{t("legal.disclaimer.fifaLabel")}</span> {t("legal.disclaimer.fifaBody")}
          </p>
        </div>

        <p>{t("legal.disclaimer.p1")}</p>
        <p>{t("legal.disclaimer.p2")}</p>
        <p>{t("legal.disclaimer.p3")}</p>
        <p>{t("legal.disclaimer.p4")}</p>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Building className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">{t("legal.title.contact")}</h2>
      </div>

      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <p className="text-white font-medium">{t("legal.contact.company")}</p>
          <p>{t("legal.contact.address1")}</p>
          <p>{t("legal.contact.address2")}</p>
          <p>{t("legal.contact.country")}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <span>{t("legal.contact.inquiries")} </span>
            <a href="mailto:support@championshipconcierge.com" className="text-primary hover:underline">
              support@championshipconcierge.com
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>{t("legal.contact.hours")}</span>
        </div>

        <p className="text-xs">{t("legal.contact.responseTime")}</p>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (section) {
      case "terms": return t("legal.title.terms");
      case "privacy": return t("legal.title.privacy");
      case "refund": return t("legal.title.refund");
      default: return t("legal.title.all");
    }
  };

  return (
    <Layout hideTitle>
      <div className="px-4 py-6 space-y-6 pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{t("legal.backToHome")}</span>
        </Link>

        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{getTitle()}</h1>
          <p className="text-sm text-muted-foreground">{t("legal.lastUpdated")}</p>
        </div>

        {section === "all" && (
          <div className="space-y-6">
            {renderDisclaimer()}
            {renderTerms()}
            {renderPrivacy()}
            {renderRefund()}
            {renderContact()}
          </div>
        )}

        {section === "terms" && (
          <div className="space-y-6">
            {renderTerms()}
            {renderContact()}
          </div>
        )}

        {section === "privacy" && (
          <div className="space-y-6">
            {renderPrivacy()}
            {renderContact()}
          </div>
        )}

        {section === "refund" && (
          <div className="space-y-6">
            {renderRefund()}
            {renderContact()}
          </div>
        )}

        <div className="text-center pt-6 border-t border-white/5">
          <p className="text-xs text-muted-foreground">{t("legal.copyright")}</p>

          {section !== "all" && (
            <div className="flex justify-center gap-4 mt-4 text-xs">
              {section !== "terms" && (
                <Link href="/terms" className="text-primary hover:underline">
                  {t("legal.nav.terms")}
                </Link>
              )}
              {section !== "privacy" && (
                <Link href="/privacy" className="text-primary hover:underline">
                  {t("legal.nav.privacy")}
                </Link>
              )}
              {section !== "refund" && (
                <Link href="/refund" className="text-primary hover:underline">
                  {t("legal.nav.refund")}
                </Link>
              )}
              <Link href="/legal" className="text-primary hover:underline">
                {t("legal.nav.all")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
