import { themes as prismThemes } from "prism-react-renderer";
import { readFileSync } from "node:fs";

const collections = JSON.parse(
  readFileSync(new URL("./site-content/collections.json", import.meta.url), "utf8"),
);

const collectionPlugins = collections.map((collection) => [
  "@docusaurus/plugin-content-docs",
  {
    id: collection.id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
    path: `.generated/collections/${collection.id}`,
    routeBasePath: `${collection.id}/practices`,
    sidebarPath: "./sidebars.practices.mjs",
    showLastUpdateTime: false,
  },
]);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Great Rabbis Skills",
  tagline: "Source-grounded practices for work, judgment, and renewal.",
  url: "https://great-rabbis-skills.vercel.app",
  baseUrl: "/",
  organizationName: "YitziG",
  projectName: "great-rabbis-skills",
  onBrokenLinks: "throw",
  markdown: {
    hooks: { onBrokenMarkdownLinks: "throw" },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    localeConfigs: {
      en: { htmlLang: "en", direction: "ltr" },
    },
  },
  presets: [
    [
      "classic",
      {
        docs: {
          path: "site-docs",
          routeBasePath: "guide",
          sidebarPath: "./sidebars.guides.mjs",
          showLastUpdateTime: false,
        },
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      },
    ],
  ],
  plugins: [
    ...collectionPlugins,
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "project",
        path: ".generated/project",
        routeBasePath: "/",
        sidebarPath: false,
        showLastUpdateTime: false,
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: "GREAT RABBIS · SKILLS",
      items: [
        { to: "/rabbi-nachman", label: "Rabbi Nachman", position: "left" },
        { to: "/lubavitcher-rebbe", label: "The Rebbe", position: "left" },
        { to: "/rav-kook", label: "Rav Kook", position: "left" },
        { to: "/guide/how-to/install", label: "Install", position: "right" },
        { href: "https://github.com/YitziG/great-rabbis-skills", label: "GitHub", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Collections",
          items: [
            { label: "Rabbi Nachman", to: "/rabbi-nachman" },
            { label: "The Lubavitcher Rebbe", to: "/lubavitcher-rebbe" },
            { label: "Rav Kook", to: "/rav-kook" },
          ],
        },
        {
          title: "Context",
          items: [
            { label: "Shared language", to: "/glossary" },
            { label: "Sources and limits", to: "/sources" },
            { label: "Project method", to: "/guide/explanation/practices-not-teachings" },
            { label: "Privacy", href: "https://github.com/YitziG/great-rabbis-skills/blob/main/PRIVACY.md" },
          ],
        },
      ],
      copyright: `Great Rabbis Skills. Modern practices, not teachings or impersonations.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    metadata: [
      { name: "theme-color", content: "#071820" },
      {
        name: "description",
        content: "Source-grounded agent practices inspired by Rabbi Nachman, the Lubavitcher Rebbe, and Rav Kook.",
      },
    ],
  },
};

export default config;
