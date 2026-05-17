import {
  Activity,
  BarChart3,
  CreditCard,
  DatabaseZap,
  Gauge,
  LayoutDashboard,
  LineChart,
  LucideIcon,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};

export type Metric = {
  label: string;
  value: string;
  delta: string;
  tone: "lime" | "dark" | "white";
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard, active: true },
  { label: "Receita", href: "#revenue", icon: LineChart },
  { label: "Clientes", href: "#customers", icon: UsersRound },
  { label: "Operacao", href: "#ops", icon: Gauge },
  { label: "Mensagens", href: "#messages", icon: MessageSquareText },
  { label: "Seguranca", href: "#security", icon: ShieldCheck },
];

export const metrics: Metric[] = [
  {
    label: "MRR monitorado",
    value: "R$ 428,9k",
    delta: "+18,4%",
    tone: "lime",
    icon: BarChart3,
  },
  {
    label: "Health score",
    value: "94,2%",
    delta: "+6,1%",
    tone: "dark",
    icon: Activity,
  },
  {
    label: "Pipeline premium",
    value: "R$ 1,82M",
    delta: "+31,7%",
    tone: "white",
    icon: Sparkles,
  },
  {
    label: "Pagamentos OK",
    value: "99,97%",
    delta: "+0,8%",
    tone: "dark",
    icon: CreditCard,
  },
];

export const revenueData = [
  { month: "Jan", receita: 190, expansao: 68 },
  { month: "Fev", receita: 235, expansao: 92 },
  { month: "Mar", receita: 248, expansao: 104 },
  { month: "Abr", receita: 315, expansao: 136 },
  { month: "Mai", receita: 372, expansao: 168 },
  { month: "Jun", receita: 429, expansao: 204 },
  { month: "Jul", receita: 486, expansao: 248 },
];

export const activities = [
  {
    title: "Segmento enterprise ativado",
    detail: "23 contas movidas para onboarding premium.",
    time: "agora",
  },
  {
    title: "Alerta de churn prevenido",
    detail: "Playbook automatizado reduziu risco em 14 contas.",
    time: "12 min",
  },
  {
    title: "Nova cohort de expansao",
    detail: "Potencial de upsell estimado em R$ 312k.",
    time: "41 min",
  },
];

export const pipelineRows = [
  {
    company: "Atlas Green",
    stage: "Contract",
    value: "R$ 284k",
    confidence: 92,
  },
  {
    company: "NovaPay",
    stage: "Security review",
    value: "R$ 198k",
    confidence: 78,
  },
  {
    company: "Volt Grid",
    stage: "Pilot",
    value: "R$ 146k",
    confidence: 64,
  },
  {
    company: "Quanta Labs",
    stage: "Expansion",
    value: "R$ 118k",
    confidence: 86,
  },
];

export const colorTokens = [
  { label: "#0F0F0F", className: "bg-[#0f0f0f]", text: "text-[#5dd62c]" },
  { label: "#202020", className: "bg-[#202020]", text: "text-[#f8f8f8]" },
  { label: "#5DD62C", className: "bg-[#5dd62c]", text: "text-[#337418]" },
  { label: "#337418", className: "bg-[#337418]", text: "text-[#0f0f0f]" },
  { label: "#F8F8F8", className: "bg-[#f8f8f8]", text: "text-[#202020]" },
];

export const commandItems = [
  { label: "Live sync", icon: Zap },
  { label: "Supabase ready", icon: DatabaseZap },
  { label: "99.97% uptime", icon: ShieldCheck },
  { label: "Signal scoring", icon: Sparkles },
];
