import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ["latin"],
});

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Adaptive. | Smart Practice Platform",
  description: "A professional platform for role-based adaptive practice, helping students and instructors achieve mastery through dynamic difficulty adjustment.",
  keywords: ["adaptive practice", "student performance", "instructor dashboard", "personalized learning", "skill mastery"],
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased selection:bg-[#BFFF00] selection:text-black"
    >
      <body className={`${roboto.className} min-h-full flex flex-col bg-[#0A0514]`}>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              fontSize: '13px',
              fontWeight: '500'
            },
          }}
        />
      </body>
    </html>
  );
}
