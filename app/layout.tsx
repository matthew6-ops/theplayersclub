import type { ReactNode } from "react";

export const metadata = {
  title: "The Players Club",
  description: "Live odds, arbitrage, and +EV finder",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-50 min-h-screen">
        <div className="min-h-screen flex justify-center">
          <div className="w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
