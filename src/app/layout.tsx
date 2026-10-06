import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/components/providers/ReduxProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Pulse | Personalized Content Dashboard',
  description: 'Track news, recommendations, and social media posts with interactive drag-and-drop customization and real-time updates.',
  keywords: ['Dashboard', 'React', 'Next.js', 'Redux Toolkit', 'TypeScript', 'Content Feed'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-slate-900 text-slate-100`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
