import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Mail, MessageCircle, Clock, HelpCircle, CreditCard, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SupportPage() {
  const { t } = useTranslation();

  const faqs = [
    {
      question: "How do I restore my purchase on a new device?",
      answer: "Use the 'Restore Purchase' button on the pricing page. Enter the email you used when purchasing, and your subscription will be restored."
    },
    {
      question: "How do I install the app on my phone?",
      answer: "On iPhone: Open Safari, tap the Share button, then 'Add to Home Screen'. On Android: Open Chrome, tap the menu (3 dots), then 'Add to Home Screen' or 'Install App'."
    },
    {
      question: "How many AI messages do I get?",
      answer: "The AI Concierge subscription includes 50 AI text messages per month. Additional 50-message packs are available for $4.99. Voice features (Talk to Concierge) don't count toward your message limit."
    },
    {
      question: "Can I get a refund?",
      answer: "Championship Concierge subscriptions are one-time purchases and non-refundable. Please review the tier features before purchasing."
    },
    {
      question: "What languages are supported?",
      answer: "The app supports 9 languages: English, Spanish, French, German, Portuguese, Arabic, Japanese, Dutch, and Italian. Use the language selector in the menu to switch."
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Support</h1>
        </div>

        <Card className="bg-card border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Have a question or need help? We're here for you.
            </p>
            
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Email Support</p>
              <a 
                href="mailto:support@championship-concierge.com"
                className="text-primary hover:underline text-lg"
              >
                support@championship-concierge.com
              </a>
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>We typically respond within 24-48 hours</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span className="text-white font-medium">Billing Issues</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Questions about payments, refunds, or subscription access
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-4 h-4 text-primary" />
                  <span className="text-white font-medium">Technical Help</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  App installation, features, or technical problems
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Championship Concierge by Mingled Treasures, LLC</p>
          <p className="mt-1">30 N Gould St, Ste R, Sheridan, WY 82801</p>
        </div>
      </div>
    </div>
  );
}
