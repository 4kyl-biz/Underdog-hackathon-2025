import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Mock Interviewer",
  description: "Realtime AI interviewer with dynamic confidence scoring.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full bg-slate-50">
        <body className="min-h-screen bg-slate-50 text-slate-900">
          <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

