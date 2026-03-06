import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HPA Studio — Review & Video Editor',
  description: 'Modern review app with AI-powered video editing, captions, viral effects, and motion graphics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
