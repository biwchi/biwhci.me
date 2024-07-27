import "../public/css/globals.css";
import { Inter } from "next/font/google";

import NavBar from "@/components/NavBar";
import ThemeProvider from "@/components/ThemeProvider";

import { AppProps } from "next/app";
import { Metadata } from "next";

import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

function setTheme() {
  if (typeof window === "undefined") {
    return;
  }

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const setting =
    localStorage.getItem("theme") || (prefersDark ? "dark" : "light");

  if (setting === "dark" || (prefersDark && setting !== "light")) {
    document.documentElement.classList.toggle("dark", true);
  }
}

const themeSetter = `
  ${setTheme}()
`;

const Art = dynamic(() => import("@/components/LeafArt"), { ssr: false });

type Props = {
  children: React.ReactNode;
} & AppProps<{ meta?: Metadata }>;

export default function RootLayout(props: Props) {
  const { children } = props;

  return (
    <html lang="en">
      <body className={inter.className}>
        <script dangerouslySetInnerHTML={{ __html: themeSetter }}></script>

        <ThemeProvider>
          <Art />

          <div className="relative z-10">
            <NavBar />
            <main className="flex px-5 max-w-screen-sm mx-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
