import Link from "next/link";
import styles from "./Mission.module.scss";
import { BiArrowToBottom } from "react-icons/bi";
export default function Mission() {
  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <h1>The Future is Now,</h1>
        <h3>Become part of our thriving network of over</h3>
        <span>12k </span>
        <h3>active members</h3>
      </div>

      <div className={styles.text}>
        <p>{`The cryptocurrency landscape is continually evolving, offering unprecedented opportunities for growth and innovation. Join ABC Virtual Bank today and unlock the potential to transform your financial future.`}</p>
        <div className="links">
          <Link href={"/signup"} className="action">
            Join Us
          </Link>
          <Link href={"/about"} className="action">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
