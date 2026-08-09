import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AbleSpace Assessment',
  description: 'Full-stack task manager assessment',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

