import { COMPANYNAME, EMAIL } from "@/app/components/js/config";
import styles from "../style.module.scss";
import Link from "next/link";
export default function Page() {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1>Careers: {COMPANYNAME}</h1>

        <div>
          <h3>No vacancy availaible at the moment</h3>
          <p>We are not recruiting at the moment, kindly check back later.</p>
          <p>
            You can earn extra income by becoming a P2P Merchant on our
            platform, for enquiries contact the live support or email us{" "}
            <Link href={`mailto:${EMAIL}`} className="linkText">
              {EMAIL}
            </Link>{" "}
            to learn more.
          </p>
        </div>
      </div>
    </div>
  );
}
