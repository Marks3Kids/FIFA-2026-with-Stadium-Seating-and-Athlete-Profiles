import { Layout } from "@/components/Layout";
import { Scale, FileText, Shield, RefreshCw, ArrowLeft, Building, Mail, Phone, Clock } from "lucide-react";
import { Link, useLocation } from "wouter";

type LegalSection = "terms" | "privacy" | "refund" | "all";

export function Legal() {
  const [location] = useLocation();
  
  const getSection = (): LegalSection => {
    if (location === "/terms") return "terms";
    if (location === "/privacy") return "privacy";
    if (location === "/refund") return "refund";
    return "all";
  };
  
  const section = getSection();

  const renderTerms = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">TERMS OF SERVICE</h2>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Last Updated: January 6, 2026</p>
        <p>Effective Date: January 12, 2026</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          These Terms of Service ("Terms") govern your use of the Championship Concierge travel guide application 
          (the "Service") provided by Mingled Treasures, LLC ("we," "our," "us"). By accessing or using the Service, 
          you agree to these Terms. If you do not agree, do not use the Service.
        </p>

        <div>
          <h3 className="text-white font-semibold mb-2">1. ACCEPTANCE OF TERMS</h3>
          <p>
            By creating an account or making a purchase, you acknowledge that you have read, understood, and agree 
            to be bound by these Terms and our Privacy Policy available at championship-concierge.com/privacy.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">2. SERVICE DESCRIPTION</h3>
          <p className="mb-3">
            Championship Concierge provides travel information and planning tools for the 2026 international soccer 
            tournament across 16 host cities in the United States, Canada, and Mexico.
          </p>
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-3">
            <p className="text-white font-medium">SERVICE INCLUDES:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="text-primary font-medium">Fan Tier ($4.99):</span> Team information, match schedules, FIFA history, global watch parties directory, and star player profiles</li>
              <li><span className="text-primary font-medium">Traveler Tier ($14.99):</span> Everything in Fan Tier plus 16-city travel guides, lodging directories, dining options, luxury travel information (private jets, yachts), road closure updates, emergency services, religious services, local transit, and 9 language support</li>
              <li><span className="text-primary font-medium">Premium Tier ($24.99):</span> Everything in Traveler Tier plus AI Travel Concierge with voice and text input, 50 messages per month (renewed monthly), with additional messages available for purchase</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">3. ELIGIBILITY</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>You must be at least 13 years old to use this Service</li>
            <li>Users under 18 must have parental or guardian consent</li>
            <li>You must provide accurate account information</li>
            <li>You represent that you have authority to enter into these Terms</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">4. USER ACCOUNTS</h3>
          <p className="text-white font-medium mb-2">ACCOUNT SECURITY:</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You must provide accurate and complete registration information</li>
            <li>One account per person</li>
            <li>You are responsible for all activities that occur under your account</li>
            <li>Notify us immediately at support@championship-concierge.com of any unauthorized access</li>
          </ul>
          <p className="text-white font-medium mb-2">ACCOUNT TERMINATION:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>You may close your account at any time</li>
            <li>We may suspend or terminate accounts that violate these Terms</li>
            <li>No refunds upon termination (except as specified in Refund Policy)</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">5. PURCHASES AND PRICING</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg mb-4">
            <p className="text-white font-medium mb-2">TIER PRICING (USD):</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Fan Tier: $4.99 (one-time purchase)</li>
              <li>Traveler Tier: $14.99 (one-time purchase)</li>
              <li>Premium Tier: $24.99 (one-time purchase)</li>
              <li>Additional AI Messages (50 pack): $4.99 (repeatable purchase for Premium tier users)</li>
            </ul>
          </div>
          <p className="text-white font-medium mb-2">PAYMENT TERMS:</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>All purchases processed securely through Stripe, Inc.</li>
            <li>Prices are in U.S. Dollars (USD)</li>
            <li>All sales are final unless eligible for refund under our Refund Policy</li>
            <li>Tier access is valid from purchase date through August 31, 2026</li>
            <li>We reserve the right to modify pricing with 30 days' advance notice</li>
            <li>Taxes may apply based on your location</li>
          </ul>
          <p className="text-white font-medium mb-2">SERVICE PERIOD:</p>
          <p>
            All tier purchases provide access through August 31, 2026. After this date, the Service will be 
            discontinued as planned. This is a tournament-specific application with a defined end date.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">6. AI TRAVEL CONCIERGE (PREMIUM TIER ONLY)</h3>
          <p className="mb-3">
            The AI Concierge feature is powered by OpenAI's GPT-5.1 technology provided through Replit's infrastructure.
          </p>
          <p className="text-white font-medium mb-2">USAGE TERMS:</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Includes 50 messages per month (resets on the 1st of each month)</li>
            <li>Each message limited to 4,000 characters</li>
            <li>Additional messages available for purchase ($4.99 for 50 messages)</li>
            <li>Supports both voice and text input</li>
            <li>Available in multiple languages</li>
          </ul>
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
            <p className="text-amber-400 font-medium mb-2">IMPORTANT DISCLAIMERS:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-200/80">
              <li>AI responses are generated automatically and may contain errors or inaccuracies</li>
              <li>AI-generated information is NOT a substitute for professional advice (legal, medical, financial, or otherwise)</li>
              <li>YOU MUST VERIFY all critical information through official sources provided in the app</li>
              <li>We are NOT responsible for decisions made based on AI responses</li>
              <li>AI may occasionally be unavailable due to technical issues</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">7. INTELLECTUAL PROPERTY</h3>
          <p className="mb-3">
            All content created for this app, excluding third-party materials, is protected by copyright. 
            You may not reproduce, distribute, or create derivative works without permission.
          </p>
          <p>
            FIFA, FIFA World Cup, and related trademarks are the property of FIFA. This application is an 
            independent fan-made companion and is NOT affiliated with, endorsed by, or connected to FIFA 
            or any official organizing bodies.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">8. LIMITATION OF LIABILITY</h3>
          <p>
            Under no circumstances shall the app developers be liable for any direct, indirect, incidental, 
            consequential, or special damages arising from your use of this application. The Service is 
            provided "as is" without any warranties, express or implied.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">9. DISPUTE RESOLUTION</h3>
          <p className="text-white font-medium mb-2">GOVERNING LAW:</p>
          <p className="mb-4">
            These Terms are governed by the laws of the State of Missouri, United States, without regard to 
            conflict of law principles.
          </p>
          <p className="text-white font-medium mb-2">INFORMAL RESOLUTION (REQUIRED FIRST STEP):</p>
          <p className="mb-4">
            Before filing any legal action, you must contact us at support@championship-concierge.com to 
            attempt informal resolution. We will work in good faith to resolve disputes within 30 days.
          </p>
          <p className="text-white font-medium mb-2">BINDING ARBITRATION:</p>
          <p className="mb-2">If informal resolution fails, disputes will be resolved through binding arbitration, NOT court.</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Conducted under American Arbitration Association (AAA) Consumer Arbitration Rules</li>
            <li>Individual basis ONLY (no class actions, class arbitrations, or representative actions)</li>
            <li>Arbitration held in Missouri or remotely (video conference)</li>
            <li>Each party bears their own costs unless AAA rules or applicable law provides otherwise</li>
            <li>Arbitrator's decision is final and binding</li>
          </ul>
          <p className="text-white font-medium mb-2">OPT-OUT OF ARBITRATION:</p>
          <p>
            You may opt-out of arbitration within 30 days of accepting these Terms by emailing 
            support@championship-concierge.com with subject line: "Arbitration Opt-Out"
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">10. CHANGES TO TERMS</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>We may update these Terms at any time</li>
            <li>Changes effective immediately upon posting</li>
            <li>Continued use after changes constitutes acceptance</li>
            <li>If you disagree with changes, stop using the Service</li>
            <li>Current version always available at championship-concierge.com/terms</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">PRIVACY POLICY</h2>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Last Updated: January 6, 2026</p>
        <p>Effective Date: January 12, 2026</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          Your use of the Service is governed by this Privacy Policy. Mingled Treasures, LLC ("we," "our," "us") 
          is committed to protecting your privacy and being transparent about how we handle your data.
        </p>

        <div>
          <h3 className="text-white font-semibold mb-2">1. INFORMATION WE COLLECT</h3>
          <p className="text-white font-medium mb-2">Minimal Data Collection:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><span className="text-primary">Email address:</span> Required for account creation and communication</li>
            <li><span className="text-primary">Location (optional):</span> Only if you enable location features for city-specific content</li>
            <li><span className="text-primary">Purchase history:</span> Transaction records processed through Stripe</li>
            <li><span className="text-primary">Premium tier only:</span> AI chat logs and voice input for Concierge feature</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">2. HOW WE USE YOUR DATA</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide and improve the Service</li>
            <li>Process purchases and manage your subscription</li>
            <li>Send important service updates and notifications</li>
            <li>Respond to support requests</li>
            <li>Personalize AI Concierge responses (Premium tier)</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">3. DATA WE DO NOT COLLECT OR SELL</h3>
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-1 text-emerald-200/80">
              <li>We do NOT use cookies for tracking</li>
              <li>We do NOT sell your data to third parties</li>
              <li>We do NOT share your data with advertisers</li>
              <li>We use localStorage only for preferences and subscription status</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">4. AI CONCIERGE & VOICE DATA</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Voice input is processed using Web Speech API (browser-native)</li>
            <li>No audio is transmitted to or stored on our servers</li>
            <li>Voice is converted to text locally on your device</li>
            <li>AI chat logs are stored in our database for conversation history</li>
            <li>You can delete your chat history at any time from Settings</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">5. DATA RETENTION</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-1">
              <li>AI chat logs are automatically deleted on <span className="text-primary font-medium">August 30, 2026</span></li>
              <li>Account data retained until you request deletion</li>
              <li>Purchase records retained as required by law</li>
              <li>The Service will be discontinued after August 31, 2026</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">6. DATA PROCESSING & SECURITY</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Data processed in the United States</li>
            <li>Subject to U.S. law</li>
            <li>GDPR compliant (for EU users)</li>
            <li>CCPA compliant (for California users)</li>
            <li>Encrypted data transmission (HTTPS)</li>
            <li>Secure payment processing via Stripe</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">7. YOUR RIGHTS</h3>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">8. CONTACT FOR PRIVACY MATTERS</h3>
          <p>
            For privacy questions or to exercise your rights, contact: 
            <a href="mailto:support@championship-concierge.com" className="text-primary hover:underline ml-1">
              support@championship-concierge.com
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
        <h2 className="text-lg font-bold text-white">REFUND POLICY</h2>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Last Updated: January 6, 2026</p>
        <p>Effective Date: January 12, 2026</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          Championship Concierge offers a limited refund policy for qualifying circumstances. 
          Please read this policy carefully before making a purchase.
        </p>

        <div>
          <h3 className="text-white font-semibold mb-2">1. REFUND ELIGIBILITY</h3>
          <p className="mb-2">Refunds may be granted within <span className="text-primary font-medium">7 days</span> of purchase for:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Technical issues preventing access to purchased features</li>
            <li>Service outages lasting more than 24 hours</li>
            <li>Device incompatibility that cannot be resolved</li>
            <li>Documented internet connectivity issues in your region</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">2. NON-REFUNDABLE SITUATIONS</h3>
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-1 text-red-200/80">
              <li>Change of mind after purchase</li>
              <li>Failure to use the Service</li>
              <li>Requests made after 7 days</li>
              <li>Account termination due to Terms violation</li>
              <li>Partial use of AI message allocation</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">3. HOW TO REQUEST A REFUND</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Email <a href="mailto:support@championship-concierge.com" className="text-primary hover:underline">support@championship-concierge.com</a></li>
            <li>Subject line: "Refund Request - [Your Email]"</li>
            <li>Include your purchase date and tier purchased</li>
            <li>Describe the qualifying circumstance</li>
            <li>Include any relevant screenshots or documentation</li>
          </ol>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">4. REFUND PROCESSING</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Refund requests reviewed within 48 business hours</li>
            <li>Approved refunds processed within 5-10 business days</li>
            <li>Refunds issued to original payment method</li>
            <li>You will receive email confirmation when processed</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">5. SERVICE DISCONTINUATION</h3>
          <p>
            The Service will end on August 31, 2026, as planned. No refunds will be issued for the 
            scheduled end of service. All users are informed of this end date at the time of purchase.
          </p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-white font-medium mb-2">Questions about refunds?</p>
          <p>
            Contact us at <a href="mailto:support@championship-concierge.com" className="text-primary hover:underline">support@championship-concierge.com</a>
          </p>
          <p className="text-xs mt-2">Response time: Within 48 business hours</p>
        </div>
      </div>
    </div>
  );

  const renderDisclaimer = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">LEGAL DISCLAIMER</h2>
      </div>
      
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
          <p className="text-amber-200">
            <span className="font-bold">DISCLAIMER:</span> This application is an independent fan-made companion app 
            and is NOT affiliated with, endorsed by, or connected to FIFA, the FIFA World Cup, or any official 
            organizing bodies.
          </p>
        </div>
        
        <p>
          All trademarks, logos, and brand names are the property of their respective owners. Any use of these 
          marks is for informational purposes only and does not imply endorsement.
        </p>
        
        <p>
          The information provided in this app is for general informational purposes only. While we strive to 
          keep the information up to date and accurate, we make no representations or warranties of any kind 
          about the completeness, accuracy, reliability, or availability of the information.
        </p>
        
        <p>
          This app may contain links to third-party websites and services. We are not responsible for the 
          content, accuracy, or practices of these external sites.
        </p>
        
        <p>
          Match schedules, venue information, transportation details, and other data are subject to change. 
          Users should verify all information through official sources before making travel arrangements.
        </p>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="bg-card border border-white/5 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Building className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-white">CONTACT INFORMATION</h2>
      </div>
      
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <p className="text-white font-medium">Mingled Treasures, LLC</p>
          <p>312 W. 2nd Street, Unit A8839</p>
          <p>Casper, WY 82601</p>
          <p>United States</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <span>All inquiries: </span>
            <a href="mailto:support@championship-concierge.com" className="text-primary hover:underline">
              support@championship-concierge.com
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>Hours: Monday-Friday, 9am-5pm CST</span>
        </div>
        
        <p className="text-xs">Response time: Within 48 business hours</p>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (section) {
      case "terms": return "TERMS OF SERVICE";
      case "privacy": return "PRIVACY POLICY";
      case "refund": return "REFUND POLICY";
      default: return "LEGAL INFORMATION";
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
          <p className="text-sm text-muted-foreground">Last updated: January 6, 2026</p>
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
          <p className="text-xs text-muted-foreground">
            © 2026 Mingled Treasures, LLC. All rights reserved.
          </p>
          
          {section !== "all" && (
            <div className="flex justify-center gap-4 mt-4 text-xs">
              {section !== "terms" && (
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
              )}
              {section !== "privacy" && (
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              )}
              {section !== "refund" && (
                <Link href="/refund" className="text-primary hover:underline">
                  Refund Policy
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
