import styles from "../../lost.module.scss";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className={styles.load}>
      <div className={styles.img}>
        <Image src={"/assets/loading.gif"} fill alt="" />
      </div>
    </div>
  );
}
