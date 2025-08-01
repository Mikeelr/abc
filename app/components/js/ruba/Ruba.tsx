"use client";
import Image from "next/image";
import styles from "./Ruba.module.scss";
export default function Ruba() {
  return (
    <div className={styles.main}>
      <div className={styles.top} id="rubaTop">
        <div className={styles.image}>
          <Image src={"/assets/bg/bg4.jpg"} alt="" fill />
        </div>
      </div>
      <div className={styles.text}>
        <h2>ABOUT YNRT TOKEN</h2>
        <p>{`Yoruba Nation Ruba Token`}</p>
        <p>{`Ruba is a versatile cryptocurrency that you can seamlessly access on our platform. Whether you're looking to buy, securely store, or effortlessly exchange Ruba, ABC Virtual Bank provides a user-friendly and reliable environment for all your digital asset needs. Join our community and experience the convenience of Ruba transactions with confidence.`}</p>
      </div>
    </div>
  );
}
