import { ReactNode } from "react";
import Nav from "./nav/Nav";
import Footer from "./footer/Footer";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
