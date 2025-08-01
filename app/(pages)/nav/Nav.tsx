"use client";
import styles from "./Nav.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserContext } from "@/app/components/js/Wrapper";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose, AiOutlineDown, AiOutlinePhone } from "react-icons/ai";
import { IconType } from "react-icons/lib";
import { BiMailSend } from "react-icons/bi";
import { TEL, EMAIL, webLink, TEL2 } from "@/app/components/js/config";

interface LinkType {
  name: string;
  link: string;
}
interface TopLinkType extends LinkType {
  icon: IconType;
}

const Nav: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { user } = useUserContext();

  const topLinks: TopLinkType[] = [
    {
      name: `${TEL}, ${TEL2}`,
      link: `tel:${TEL}`,
      icon: AiOutlinePhone,
    },
    {
      name: EMAIL,
      link: `mailto:${EMAIL}`,
      icon: BiMailSend,
    },
  ];
  const mainLinks: LinkType[] = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Blog",
      link: "/blog",
    },
    {
      name: "Fssc",
      link: "/fssc",
    },
    {
      name: "Contact Us",
      link: "/contact",
    },
  ];

  useEffect(() => {
    const toggleShow = () => {
      const anchor = document.querySelectorAll("a");
      anchor.forEach((a) => {
        if (!a.href.includes("#"))
          a.addEventListener("click", () => {
            setShow(false);
          });
      });
    };
    return toggleShow();
  }, []);
  useEffect(() => {
    const handler = () => {
      const body = document.querySelector("body");
      const top = body?.getBoundingClientRect().top || 0;
      if (top < -120) setScrolled(true);
      else {
        setScrolled(false);
      }
    };
    const scroller = document.addEventListener("scroll", (e) => handler());
    return document.removeEventListener("scroll", () => scroller);
  }, []);

  return (
    <div className={styles.box}>
      <div className={styles.holder}></div>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.top}>
          {topLinks.map((e, i) => (
            <Link href={e.link} key={i}>
              <e.icon className={styles.icon} />
              <span style={{ fontSize: "0.8rem", textTransform: "lowercase" }}>
                {e.name}
              </span>
            </Link>
          ))}
        </div>
        <div className={styles.bottom}>
          <div className={styles.right}>
            <Link href={"/"} className={styles.logo}>
              <Image src={"/logo.png"} fill alt={webLink} />
            </Link>
          </div>
          <div className={styles.menuIcon} onClick={() => setShow(!show)}>
            {show ? (
              <AiOutlineClose className={styles.icon} />
            ) : (
              <HiMenuAlt3 className={styles.icon} />
            )}
          </div>
          <div
            className={
              show
                ? `${styles.left} ${styles.show}`
                : `${styles.left} ${styles.hide}`
            }
          >
            <ul className={styles.otherLinks}>
              {mainLinks.map((parent, i) => (
                <li key={i}>
                  <Link href={parent.link}>
                    <span className={styles.title}>{parent.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {user ? (
              <ul className={styles.account}>
                <li>
                  <Link href={"/dashboard"} className={styles.name}>
                    {user.sName[0] + user.oNames[0]}
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className={styles.account}>
                <li>
                  <Link href={"/signup"}>Signup</Link>
                </li>
                <li>
                  <Link href={"/login"}>Login</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
