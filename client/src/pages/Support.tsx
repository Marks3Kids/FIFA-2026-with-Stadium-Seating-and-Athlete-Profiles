import { Link } from "wouter";
import { ArrowLeft, Mail, MessageCircle, Clock, HelpCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export function Support() {
  const { t } = useTranslation();

  return (
    <Layout hideTitle>
      <div className="px-4 py-6 space-y-6 pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading">CUSTOMER SUPPORT</h1>
          <p className="text-muted-foreground text-sm">We're here to help</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="w-5 h-5 text-emerald-500" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              For any questions, issues, or refund requests, please contact our support team:
            </p>
            <a 
              href="mailto:support@championship-concierge.com" 
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <Mail className="w-4 h-4" />
              support@championship-concierge.com
            </a>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-emerald-500" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              We typically respond to all inquiries within 24-48 hours. During the tournament period (June-July 2026), 
              we aim for faster response times to ensure you have the best experience.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="w-5 h-5 text-emerald-500" />
              Common Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-1">How do I upgrade my subscription?</h4>
              <p className="text-muted-foreground text-sm">
                Visit our <Link href="/pricing" className="text-emerald-400 hover:underline">Pricing page</Link> to view available tiers and upgrade options.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Can I get a refund?</h4>
              <p className="text-muted-foreground text-sm">
                Yes! We offer a 7-day refund policy for qualifying circumstances. See our <Link href="/refund" className="text-emerald-400 hover:underline">Refund Policy</Link> for details.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Is my data secure?</h4>
              <p className="text-muted-foreground text-sm">
                Absolutely. Read our <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link> to learn how we protect your information.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="w-5 h-5 text-emerald-500" />
              AI Concierge Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              AI Concierge subscribers can get instant help through the in-app AI assistant for travel questions, 
              city recommendations, and real-time support during the tournament.
            </p>
          </CardContent>
        </Card>

        <div className="text-center pt-4 border-t border-slate-700 space-y-2">
          <p className="text-muted-foreground text-sm">
            View our legal documents:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Terms of Use
            </Link>
            <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refund" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Support;
