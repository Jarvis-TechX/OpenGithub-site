import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { ReactNode } from "react";
import Script from "next/script";

export const metadata: Metadata = {
  title: "OpenGithub — Trending Archive",
  description: "Browse GitHub Trending snapshots (daily/weekly/monthly) with archive history."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var e=t==="dark"||t==="light"?t:null;if(!e){var m=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)");e=m&&m.matches?"dark":"light"}if(e==="dark")document.documentElement.dataset.theme="dark";else document.documentElement.removeAttribute("data-theme")}catch(_){}})();`
          }}
        />
      </head>
      <body>
        <div className="min-h-dvh">
          <Header />
          <main className="mx-auto w-full max-w-[1120px] px-4 pb-12 pt-6 sm:px-6">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
