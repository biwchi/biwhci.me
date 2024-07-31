import "../public/css/globals.css";
import { Inter } from "next/font/google";

import NavBar from "@/components/NavBar";
import ThemeProvider from "@/components/ThemeProvider";
import dynamic from "next/dynamic";

import { AppProps } from "next/app";
import { cookies } from "next/headers";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

const LeafArt = dynamic(() => import("@/components/Art/LeafArt"), {
  ssr: false,
  loading: () => <div></div>,
});

const MeteorArt = dynamic(() => import("@/components/Art/MeteorArt"), {
  ssr: false,
  loading: () => <div></div>,
});

type Props = {
  children: React.ReactNode;
} & AppProps<{ meta?: Metadata }>;

export default function RootLayout(props: Props) {
  const { children } = props;

  const cookie = cookies();
  const theme = cookie.get("theme");

  return (
    <html lang="en" className={theme?.value === "dark" ? "dark" : ""}>
      <body className={inter.className}>
        <ThemeProvider>
          <LeafArt />

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
