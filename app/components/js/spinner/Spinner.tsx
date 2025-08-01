import styles from "./Spiner.module.scss";
import gif from "../../media/load.gif";
import Image from "next/image";
export default function Spinner({ error }: { error: string }) {
  return (
    <div className={styles.spinner}>
      <div className={styles.img}>
        <Image src={gif} alt="" fill />
      </div>
      <span className={styles.error}>{error}</span>
    </div>
  );
}
