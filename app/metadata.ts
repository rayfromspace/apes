import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'coLABapes | Collaborate, Create, Innovate',
  description: 'A dynamic platform connecting creators, investors, and collaborators in a single ecosystem.',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/logo.png',
        href: '/logo.png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/logo-dark.png',
        href: '/logo-dark.png',
      },
    ],
  },
};
