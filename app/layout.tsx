import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "The Players Club",
  description: "Live odds, arbitrage & +EV scanner",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050509] text-slate-100 antialiased">
        <div className="min-h-screen bg-gradient-to-b from-[#050509] via-[#050509] to-[#050509]">
          {children}
        </div>
      </body>
    </html>
  );
}
