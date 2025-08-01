"use client";
import Link from "next/link";
import styles from "./Footer.module.scss";

import Image from "next/image";
import { COMPANYNAME } from "@/app/components/js/config";
interface Link {
  name: string;
  link: string;
}
interface Row {
  main: string;
  links: Link[];
}
const Footer: React.FC = () => {
  const links: Row[] = [
    {
      main: COMPANYNAME,
      links: [
        {
          name: "Home",
          link: "/",
        },
        {
          name: "About Us",
          link: "/about",
        },
        {
          name: "Careers",
          link: "/careers",
        },

        {
          name: "Disclaimer",
          link: "/disclaimer",
        },
      ],
    },
    {
      main: "Other Links",
      links: [
        { name: "Sign Up", link: "/signup" },
        { name: "Login", link: "/login" },
        { name: "Blog", link: "/blog" },

        { name: "Terms of Use", link: "/terms" },
        { name: "Privacy Policy", link: "/privacy" },
      ],
    },
  ];

  const date = new Date();
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.company}>
          <div className={styles.logo}>
            <Image src={"/logo.png"} fill alt={COMPANYNAME} />
          </div>
          <h4>{COMPANYNAME}</h4>
          <p>{`In the dynamic realm of cryptocurrency, ABC Virtual Bank distinguishes itself as a dependable and inclusive platform for both enthusiasts and investors. With a broad spectrum of services, ABC Virtual Bank has secured its reputation as a respected leader within the burgeoning cryptocurrency ecosystem.`}</p>
        </div>
        {links.map((link, index) => {
          return (
            <div key={index} className={styles.links}>
              <p>{link.main}</p>
              <ul>
                {link.links.map((subLink, index) => {
                  return (
                    <li key={index}>
                      <Link href={subLink.link}>{subLink.name}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <div className={styles.copy}>
        <p>
          &copy; {date.getFullYear()} {COMPANYNAME}. All rights reserved.{" "}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
