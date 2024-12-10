import { NavItem } from "@/types/nav";

export type NavigationConfig = typeof navigationConfig;

export const navigationConfig = {
  main: [
    {
      title: "Home",
      href: "/",
      public: true,
    },
    {
      title: "Explore",
      href: "/explore",
      public: true,
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      protected: true,
    },
    {
      title: "Projects",
      href: "/projects",
      protected: true,
    },
    {
      title: "Messages",
      href: "/messages",
      protected: true,
    },
    {
      title: "Learning",
      href: "/learning",
      public: true,
    },
  ] satisfies NavItem[],
  
  auth: [
    {
      title: "Login",
      href: "/login",
      public: true,
    },
    {
      title: "Register",
      href: "/register",
      public: true,
    },
  ] satisfies NavItem[],

  footer: {
    solutions: [
      { title: "Marketing", href: "#" },
      { title: "Analytics", href: "#" },
      { title: "Commerce", href: "#" },
      { title: "Insights", href: "#" },
    ],
    support: [
      { title: "Pricing", href: "#" },
      { title: "Documentation", href: "#" },
      { title: "Guides", href: "#" },
      { title: "API Status", href: "#" },
    ],
    company: [
      { title: "About", href: "#" },
      { title: "Blog", href: "#" },
      { title: "Jobs", href: "#" },
      { title: "Press", href: "#" },
      { title: "Partners", href: "#" },
    ],
    legal: [
      { title: "Privacy", href: "#" },
      { title: "Terms", href: "#" },
      { title: "Cookies", href: "#" },
      { title: "License", href: "#" },
    ],
    social: [
      {
        title: "Twitter",
        href: "#",
        icon: "twitter",
      },
      {
        title: "GitHub",
        href: "#",
        icon: "github",
      },
      {
        title: "Discord",
        href: "#",
        icon: "discord",
      },
    ],
  },

  mobile: {
    bottomNav: [
      {
        title: "Home",
        href: "/",
        icon: "home",
      },
      {
        title: "Explore",
        href: "/explore",
        icon: "search",
      },
      {
        title: "Projects",
        href: "/projects",
        icon: "folder",
      },
      {
        title: "Profile",
        href: "/profile",
        icon: "user",
      },
    ],
  },
} as const;
