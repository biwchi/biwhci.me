import "../public/css/globals.css";
import { Inter } from "next/font/google";

import NavBar from "@/components/NavBar";
import ThemeProvider from "@/components/ThemeProvider";
import LeafArt from "@/components/LeafArt";

import { AppProps } from "next/app";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

function setTheme() {
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

type Props = {
  children: React.ReactNode;
} & AppProps<{ meta?: Metadata }>;

export default function RootLayout(props: Props) {
  const { children, pageProps } = props;
  console.log(props, 'EBLAN')

  const title = pageProps?.meta?.title as string ?? "Biwchi";
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className={inter.className}>
        <script dangerouslySetInnerHTML={{ __html: themeSetter }}></script>

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
