import { NextRequest, NextResponse } from "next/server";

// Category visual palettes and SVG icons
interface CategoryTheme {
  bgStart: string;
  bgEnd: string;
  accent: string;
  iconSvg: string;
  labelAr: string;
}

const categoryThemes: Record<string, CategoryTheme> = {
  electronics: {
    bgStart: "#111827",
    bgEnd: "#1F2937",
    accent: "#60A5FA",
    labelAr: "إلكترونيات وأجهزة ذكية",
    iconSvg: `<rect x="70" y="30" width="100" height="180" rx="16" fill="none" stroke="#60A5FA" stroke-width="6"/>
      <circle cx="120" cy="185" r="8" fill="#60A5FA"/>
      <line x1="100" y1="45" x2="140" y2="45" stroke="#60A5FA" stroke-width="4" stroke-linecap="round"/>`,
  },
  fashion: {
    bgStart: "#1E1B18",
    bgEnd: "#2D2620",
    accent: "#E28B59",
    labelAr: "أزياء وموضة فاخرة",
    iconSvg: `<path d="M70,50 L95,85 L120,60 L145,85 L170,50 L190,95 L165,115 L165,200 L75,200 L75,115 L50,95 Z" fill="none" stroke="#E28B59" stroke-width="6" stroke-linejoin="round"/>
      <line x1="120" y1="95" x2="120" y2="190" stroke="#E28B59" stroke-width="4" stroke-dasharray="6 6"/>`,
  },
  "home-living": {
    bgStart: "#1B2421",
    bgEnd: "#23332D",
    accent: "#34D399",
    labelAr: "منزل ومعيشة وديكور",
    iconSvg: `<path d="M50,140 C50,110 70,90 90,90 L150,90 C170,90 190,110 190,140 L190,170 L50,170 Z" fill="none" stroke="#34D399" stroke-width="6"/>
      <rect x="65" y="170" width="110" height="25" rx="6" fill="none" stroke="#34D399" stroke-width="5"/>
      <line x1="75" y1="195" x2="70" y2="215" stroke="#34D399" stroke-width="6" stroke-linecap="round"/>
      <line x1="165" y1="195" x2="170" y2="215" stroke="#34D399" stroke-width="6" stroke-linecap="round"/>`,
  },
  gaming: {
    bgStart: "#1A102F",
    bgEnd: "#29164A",
    accent: "#A78BFA",
    labelAr: "ألعاب وقيمنق واحتراف",
    iconSvg: `<rect x="50" y="80" width="140" height="90" rx="35" fill="none" stroke="#A78BFA" stroke-width="6"/>
      <line x1="75" y1="125" x2="95" y2="125" stroke="#A78BFA" stroke-width="5" stroke-linecap="round"/>
      <line x1="85" y1="115" x2="85" y2="135" stroke="#A78BFA" stroke-width="5" stroke-linecap="round"/>
      <circle cx="145" cy="118" r="6" fill="#A78BFA"/>
      <circle cx="160" cy="132" r="6" fill="#A78BFA"/>`,
  },
  "beauty-accessories": {
    bgStart: "#281720",
    bgEnd: "#3D2030",
    accent: "#F472B6",
    labelAr: "تجميل وعطور وإكسسوارات",
    iconSvg: `<rect x="80" y="90" width="80" height="110" rx="12" fill="none" stroke="#F472B6" stroke-width="6"/>
      <rect x="95" y="55" width="50" height="35" rx="6" fill="none" stroke="#F472B6" stroke-width="5"/>
      <circle cx="120" cy="145" r="22" fill="none" stroke="#F472B6" stroke-width="4"/>`,
  },
  healthcare: {
    bgStart: "#0F2426",
    bgEnd: "#1A383B",
    accent: "#2DD4BF",
    labelAr: "صحة ورعاية طبية معتمدة",
    iconSvg: `<path d="M120,60 C90,30 40,55 40,105 C40,155 120,205 120,205 C120,205 200,155 200,105 C200,55 150,30 120,60 Z" fill="none" stroke="#2DD4BF" stroke-width="6"/>
      <line x1="120" y1="90" x2="120" y2="140" stroke="#2DD4BF" stroke-width="6" stroke-linecap="round"/>
      <line x1="95" y1="115" x2="145" y2="115" stroke="#2DD4BF" stroke-width="6" stroke-linecap="round"/>`,
  },
  "real-estate": {
    bgStart: "#0D1B2A",
    bgEnd: "#1B263B",
    accent: "#C4933F",
    labelAr: "عقارات ومشاريع سكنية",
    iconSvg: `<polygon points="120,40 45,100 65,100 65,200 175,200 175,100 195,100" fill="none" stroke="#C4933F" stroke-width="6" stroke-linejoin="round"/>
      <rect x="100" y="130" width="40" height="70" fill="none" stroke="#C4933F" stroke-width="5"/>
      <rect x="80" y="105" width="22" height="22" rx="3" fill="none" stroke="#C4933F" stroke-width="4"/>
      <rect x="138" y="105" width="22" height="22" rx="3" fill="none" stroke="#C4933F" stroke-width="4"/>`,
  },
  vehicles: {
    bgStart: "#141C24",
    bgEnd: "#1E293B",
    accent: "#38BDF8",
    labelAr: "سيارات ومركبات فاخرة",
    iconSvg: `<path d="M45,145 L65,100 C72,85 88,80 105,80 L145,80 C162,80 178,85 185,100 L205,145 L210,170 C210,175 205,180 200,180 L190,180 C185,180 180,175 180,170 L70,170 C70,175 65,180 60,180 L50,180 C45,180 40,175 40,170 Z" fill="none" stroke="#38BDF8" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="75" cy="155" r="14" fill="none" stroke="#38BDF8" stroke-width="5"/>
      <circle cx="175" cy="155" r="14" fill="none" stroke="#38BDF8" stroke-width="5"/>
      <line x1="80" y1="105" x2="170" y2="105" stroke="#38BDF8" stroke-width="4"/>`,
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("cat") || searchParams.get("category") || "electronics";
  const title = searchParams.get("title") || searchParams.get("t") || "سوقرا SOUQORA";
  const width = Math.min(Math.max(parseInt(searchParams.get("w") || "600"), 100), 1600);
  const height = Math.min(Math.max(parseInt(searchParams.get("h") || "600"), 100), 1200);

  const fallbackTheme: CategoryTheme = categoryThemes.electronics || {
    bgStart: "#111827",
    bgEnd: "#1F2937",
    accent: "#60A5FA",
    labelAr: "إلكترونيات وأجهزة ذكية",
    iconSvg: `<rect x="70" y="30" width="100" height="180" rx="16" fill="none" stroke="#60A5FA" stroke-width="6"/><circle cx="120" cy="185" r="8" fill="#60A5FA"/>`,
  };

  const theme: CategoryTheme = categoryThemes[category] ?? fallbackTheme;

  // Escape special XML characters
  const cleanTitle = title
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .slice(0, 70);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bgStart}"/>
      <stop offset="100%" stop-color="${theme.bgEnd}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>

  <!-- Centered Icon Illustration -->
  <g transform="translate(${width / 2 - 120}, ${height / 2 - 120})">
    <circle cx="120" cy="120" r="100" fill="${theme.accent}" fill-opacity="0.06"/>
    <circle cx="120" cy="120" r="80" fill="none" stroke="${theme.accent}" stroke-width="1.5" stroke-opacity="0.2" stroke-dasharray="4 6"/>
    ${theme.iconSvg}
  </g>

  <!-- Brand Watermark Top -->
  <g transform="translate(${width / 2}, 36)" text-anchor="middle">
    <rect x="-45" y="-14" width="90" height="26" rx="6" fill="#ffffff" fill-opacity="0.08"/>
    <text y="4" font-family="'Cairo', system-ui, sans-serif" font-size="11" font-weight="700" fill="#ffffff" fill-opacity="0.8" letter-spacing="1">SOUQORA</text>
  </g>

  <!-- Category Badge Bottom -->
  <g transform="translate(${width / 2}, ${height - 65})" text-anchor="middle">
    <rect x="-80" y="-14" width="160" height="26" rx="13" fill="${theme.accent}" fill-opacity="0.15" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.4"/>
    <text y="4" font-family="'Cairo', system-ui, sans-serif" font-size="11" font-weight="600" fill="${theme.accent}">${theme.labelAr}</text>
  </g>

  <!-- Title Bottom -->
  <text x="${width / 2}" y="${height - 25}" text-anchor="middle" font-family="'Cairo', system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff" fill-opacity="0.95">${cleanTitle}</text>
</svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
