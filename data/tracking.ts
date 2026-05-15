import type { EventType } from "@/stores/tracking-store";

export interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  spend: number;
  leads: number;
  purchases: number;
  revenue: number;
  roas: number;
  source: "meta_ads" | "whatsapp" | "organic";
}

export const campaigns: Campaign[] = [
  {
    id: "camp_01",
    name: "Black Friday WhatsApp",
    status: "active",
    spend: 12480,
    leads: 847,
    purchases: 234,
    revenue: 89420,
    roas: 7.17,
    source: "meta_ads",
  },
  {
    id: "camp_02",
    name: "Remarketing Checkout",
    status: "active",
    spend: 8340,
    leads: 523,
    purchases: 187,
    revenue: 64280,
    roas: 7.71,
    source: "meta_ads",
  },
  {
    id: "camp_03",
    name: "Lancamento Premium",
    status: "active",
    spend: 15600,
    leads: 1284,
    purchases: 412,
    revenue: 128900,
    roas: 8.26,
    source: "whatsapp",
  },
];

export const funnelStages = [
  { label: "Ad Click", count: 12847 },
  { label: "WhatsApp", count: 8234 },
  { label: "Checkout", count: 4892 },
  { label: "Purchase", count: 2341 },
];

export const eventTemplates: {
  type: EventType;
  source: string;
  campaign: string;
  valueRange?: [number, number];
}[] = [
  { type: "pageview", source: "Meta Ads", campaign: "Black Friday WhatsApp" },
  { type: "pageview", source: "Meta Ads", campaign: "Remarketing Checkout" },
  {
    type: "whatsapp_click",
    source: "WhatsApp",
    campaign: "Black Friday WhatsApp",
  },
  {
    type: "whatsapp_click",
    source: "WhatsApp",
    campaign: "Lancamento Premium",
  },
  {
    type: "checkout_init",
    source: "Checkout",
    campaign: "Remarketing Checkout",
    valueRange: [97, 497],
  },
  {
    type: "checkout_init",
    source: "Checkout",
    campaign: "Black Friday WhatsApp",
    valueRange: [147, 997],
  },
  {
    type: "purchase",
    source: "Checkout",
    campaign: "Black Friday WhatsApp",
    valueRange: [147, 997],
  },
  {
    type: "purchase",
    source: "Checkout",
    campaign: "Lancamento Premium",
    valueRange: [297, 1497],
  },
  { type: "lead", source: "WhatsApp", campaign: "Black Friday WhatsApp" },
  { type: "lead", source: "Meta Ads", campaign: "Remarketing Checkout" },
];
