import Image from "next/image";

import styles from "./Carousel.module.scss";

import Link from "next/link";
import { COMPANYNAME } from "../config";

const Carousel: React.FC = () => {
  return (
    <div className={styles.holder}>
      <div className={styles.carousel} id="carousel">
        <div className={styles.img}>
          <Image src={"/assets/banner.jpg"} fill alt={COMPANYNAME} />
        </div>
        <div className={styles.text}>
          <h2>Explore Digital Finance with </h2>
          <h1>ABC Virtual Bank</h1>

          <p
            className={styles.smText}
          >{`Welcome to ABC Virtual Bank, your reliable partner in digital investments. We provide a full spectrum of digital finance services — from secure trading and storage to advanced mining and investment options. Our mission is to make cryptocurrency accessible and manageable for everyone, whether you're a beginner or a seasoned investor.`}</p>

          <div className={styles.links}>
            <Link href="/about">About us</Link>
            <Link href="/signup">Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface TopperType {
  img: string;
  title: string;
  text: string[];
}
interface TopperProp {
  data: TopperType;
}
export const Topper: React.FC<TopperProp> = ({ data }) => {
  return (
    <div className={`${styles.holder} ${styles.topper}`}>
      <div className={`${styles.carousel} ${styles.scrolled} `}>
        <div className={styles.img}>
          <Image src={data.img} fill alt={COMPANYNAME} />
        </div>
        <div className={styles.text}>
          <h1>{data.title}</h1>

          {data.text.map((e, i) => (
            <p className={styles.smText} key={i}>
              {e}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
