export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  bestFor: string;
  features: string[];
  cta: string;
  popular: boolean;
  highlight: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "AI-Video Starter",
    price: "$599",
    period: "(one-time)",
    description: "Perfect for testing AI videos with high quality",
    bestFor:
      "Businesses needing a high-quality batch of videos for a launch or social media kick-start",
    features: [
      "4 AI-Video Shorts",
      "Up to 30 seconds each",
      "1 Format (Portrait or Landscape)",
      "Standard AI-generated scripts",
      "Standard AI Voice",
      "Included Subtitles",
      "1 Round of revisions",
      "Standard Logo Watermark",
      "Email Support",
    ],
    cta: "Get Started",
    popular: false,
    highlight: false,
  },
  {
    name: "Business Growth Engine",
    price: "$997",
    period: "(one-time)",
    description: "Best value for growing brands with diverse content needs",
    bestFor:
      "Businesses actively marketing who need a consistent and diverse stream of content",
    features: [
      "8 AI-Video Shorts",
      "Up to 45 seconds each",
      "2 Formats (Portrait & Landscape)",
      "Custom collaborative scripts",
      "Premium AI Voice (Human-like)",
      "Included Subtitles",
      "2 Rounds of revisions",
      "Custom Branding (Colors, fonts)",
      "Priority Email & Chat Support",
    ],
    cta: "Get Started",
    popular: true,
    highlight: true,
  },
  {
    name: "AI Marketing Partner",
    price: "$1,799",
    period: "/month",
    description: "For serious content creators managing entire video strategy",
    bestFor:
      "Businesses seeking a long-term, hands-off partner to manage their entire video strategy",
    features: [
      "12+ Custom Videos/month",
      "Custom video lengths",
      "All Required Formats",
      "Full Script-to-Screen Production",
      "Premium AI Voice",
      "Included Subtitles",
      "Unlimited revisions",
      "Full Brand Integration",
      "Priority Support + Monthly Strategy Call",
    ],
    cta: "Book a Call",
    popular: false,
    highlight: false,
  },
];

// Feature comparison map for detailed info
export const featureDetails: Record<string, Record<string, string>> = {
  "Video Deliverables": {
    "AI-Video Starter": "4 AI-Video Shorts",
    "Business Growth Engine": "8 AI-Video Shorts",
    "AI Marketing Partner": "12+ Custom Videos",
  },
  "Video Length": {
    "AI-Video Starter": "Up to 30 seconds",
    "Business Growth Engine": "Up to 45 seconds",
    "AI Marketing Partner": "Custom (Shorts, Explainers, etc.)",
  },
  "Video Formats": {
    "AI-Video Starter": "1 Format (Portrait OR Landscape)",
    "Business Growth Engine": "2 Formats (Portrait AND Landscape)",
    "AI Marketing Partner": "All Required Formats",
  },
  Scripting: {
    "AI-Video Starter": "Standard (AI-generated from brief)",
    "Business Growth Engine": "Custom (Collaborative scriptwriting)",
    "AI Marketing Partner": "Full Script-to-Screen Production",
  },
  "Voice-Over": {
    "AI-Video Starter": "Standard AI Voice",
    "Business Growth Engine": "Premium AI Voice (Human-like)",
    "AI Marketing Partner": "Premium AI Voice",
  },
  Revisions: {
    "AI-Video Starter": "1 Round per batch",
    "Business Growth Engine": "2 Rounds per batch",
    "AI Marketing Partner": "Unlimited (within scope)",
  },
  Branding: {
    "AI-Video Starter": "Standard Logo Watermark",
    "Business Growth Engine": "Custom Branding (Colors, fonts)",
    "AI Marketing Partner": "Full Brand Integration",
  },
  Support: {
    "AI-Video Starter": "Email Support",
    "Business Growth Engine": "Priority Email & Chat Support",
    "AI Marketing Partner": "Priority Support + Monthly Strategy Call",
  },
};
