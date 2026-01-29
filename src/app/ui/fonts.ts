import { Nunito, Changa_One } from "next/font/google";

export const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-nunito",
});

export const changaOne = Changa_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-changa",
});
