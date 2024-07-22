import "../public/css/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import NavBar from "@/components/NavBar";
import ThemeProvider from "@/components/ThemeProvider";
import LeafArt from "@/components/LeafArt";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biwchi",
  description: "Biwchi's personal website",
};

const themeSetter = `
(function () {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const setting = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light')

  if (setting === 'dark' || (prefersDark && setting !== 'light')) {
    document.documentElement.classList.toggle('dark', true)
  }
    })()
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script dangerouslySetInnerHTML={{ __html: themeSetter }}></script>

        <ThemeProvider>
          <LeafArt />

          <div className='relative z-10'>
            <NavBar />
            <main className="flex max-w-screen-sm mx-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
