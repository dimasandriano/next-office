import { Metadata } from 'next';
import * as React from 'react';
import { Toaster } from 'sonner';

import '@/styles/globals.css';

import TanstackQueryProvider from '@/lib/provider/tanstack-query.provider';
import { ThemeProvider } from '@/lib/provider/theme.provider';

import { siteConfig } from '@/constant/config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
    creator: '@dimasandriano_h',
  },
  authors: [
    {
      name: 'Dimas Andriano',
      url: 'https://dimasandriano.is-a.dev',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang='en'>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors position='bottom-right' />
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
