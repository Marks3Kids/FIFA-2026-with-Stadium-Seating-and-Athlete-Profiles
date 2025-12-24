import { Layout } from "@/components/Layout";
import { PricingSection } from "@/components/PricingSection";

export default function Pricing() {
  return (
    <Layout pageTitle="nav.pricing">
      <div className="px-6 py-8">
        <PricingSection cancelUrl="/pricing" />
      </div>
    </Layout>
  );
}
