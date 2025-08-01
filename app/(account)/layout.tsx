import { ReactNode } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <div className={styles.left}>
          <Link className={styles.img} href={"/"}>
            <Image src={"/logo.png"} fill alt="" />
          </Link>
        </div>
        <div className={styles.right}>
          <Link href={"/"}>Home</Link>
          <Link href={"/about"}>About Us</Link>
          <Link href={"/terms"}>Terms</Link>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.left}>
          <Image src={"/assets/login.webp"} fill alt="" />
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
