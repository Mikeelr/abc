import Wrap from "./components/js/Wrapper";
import { COMPANYNAME } from "./components/js/config";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: COMPANYNAME,
  description: "Buy, trade, store and send Ruba and other Cryptocurrencies",
  icons: [{ rel: "icon", url: "/icon.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Wrap>{children}</Wrap>
      </body>
    </html>
  );
}
