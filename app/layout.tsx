import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { fontMono, fontRethink, fontSans } from "@/config/fonts";


import { Providers } from "./providers";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: "Consulta tu licencia Profit",
    template: `%s - Consulta tu licencia Profit`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/LogoPP.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx(
          "h-screen bg-custom-radial font-rethink",
          fontSans.variable,
          fontMono.variable,
          fontRethink.variable
        )}>
        <Providers themeProps={{ attribute: "class"}}>
            <main className="h-full">
              {children}
            </main>
        </Providers>
      </body>
    </html>
  );
}
