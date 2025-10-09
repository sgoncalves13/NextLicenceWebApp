import { Fira_Code as FontMono, Inter as FontSans, Rethink_Sans as FontRethink } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontRethink = FontRethink({
  subsets: ["latin"],
  variable: "--font-rethink",
});