import { Instrument_Sans, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";

// Fonts are downloaded at build time and self-hosted by next/font —
// no request to Google is made by visitors.
const sans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-sans",
  display: "swap",
  axes: ["wdth"],
});

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const fontVariables = `${sans.variable} ${serif.variable} ${mono.variable}`;
