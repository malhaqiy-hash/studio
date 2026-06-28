import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { AccountProvider } from '@/context/account-context';
import { AIAssistant } from '@/components/chat/ai-assistant';
import { BRAND } from '@/config/appConfig';

export const metadata: Metadata = {
  title: `${BRAND.name} - Business Discovery Network`,
  description: `${BRAND.name} — AI-powered business discovery and intelligence.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-accent/20 selection:text-accent">
        <LanguageProvider>
          <AccountProvider>
            <FirebaseClientProvider>
              {children}
              <Toaster />
              <AIAssistant />
            </FirebaseClientProvider>
          </AccountProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
