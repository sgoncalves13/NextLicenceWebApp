import "@/styles/globals.css";
import { Metadata, Viewport } from "next";


import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import Header from "@/components/header";

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
      <body className="h-screen bg-linear-115 from-[#00a0df] to-[#003592]">
        <Providers themeProps={{ attribute: "class"}}>
            <Header />
            <main className="h-10/12">
              {children}
            </main>
        </Providers>
      </body>
    </html>
  );
}
