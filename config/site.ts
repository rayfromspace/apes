export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Startup Hub",
  description:
    "A platform connecting founders and investors, facilitating project collaboration and investment opportunities.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Explore",
      href: "/explore",
    },
    {
      title: "Learn",
      href: "/learning",
    },
  ],
  links: {
    github: "https://github.com/yourusername/startup-hub",
    docs: "/docs",
    twitter: "https://twitter.com/startuphub",
    discord: "https://discord.gg/startuphub",
  },
  seo: {
    title: "Startup Hub - Connect, Collaborate, Invest",
    description:
      "Join Startup Hub to connect with founders and investors, collaborate on innovative projects, and discover investment opportunities.",
    keywords: [
      "startup",
      "investment",
      "collaboration",
      "founders",
      "investors",
      "projects",
    ],
    ogImage: "https://yourdomain.com/og-image.jpg",
    twitterCard: "summary_large_image",
  },
  features: {
    auth: {
      providers: ["github", "google"],
      requireVerification: true,
    },
    projects: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedFileTypes: ["image/jpeg", "image/png", "application/pdf"],
      maxTeamSize: 10,
    },
    investments: {
      minAmount: 1000,
      currencies: ["USD", "EUR", "GBP"],
      requireKYC: true,
    },
  },
  theme: {
    defaultTheme: "system",
    availableThemes: ["light", "dark", "system"],
  },
} as const;
