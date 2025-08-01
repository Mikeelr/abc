import Image from "next/image";
import Link from "next/link";
import styles from "./Wallet.module.scss";
import { CryptoAndWalletResponseType } from "@/app/components/js/dataTypes";
const WalletList: React.FC<{ wallets: CryptoAndWalletResponseType[] }> = ({
  wallets,
}) => {
  return (
    <div className={styles.wallets}>
      {wallets.map((wallet) => (
        <Wallet wallet={wallet} key={wallet._id} />
      ))}
    </div>
  );
};

export const Wallet: React.FC<{ wallet: CryptoAndWalletResponseType }> = ({
  wallet,
}) => {
  return (
    <Link
      className={styles.wallet}
      href={`/dashboard/transactions?coinName=${wallet.symbol}`}
    >
      <div className={styles.left}>
        <Image
          src={wallet.image}
          fill
          alt=""
          loader={({ src, width }) => `${src}?w=${width}`}
        />
      </div>
      <div className={styles.center}>
        <p className={styles.name}>{wallet.name}</p>
        <p className={styles.price}>
          ${wallet.current_price.toLocaleString("USA")}
        </p>
        <span>Market Price</span>
      </div>
      <div className={styles.right}>
        <p className={styles.amount}>
          ${(wallet.current_price * wallet.balance).toLocaleString("en-US")}
        </p>
        <p className={styles.sm}>
          {wallet.symbol.toUpperCase()} {wallet.balance.toLocaleString("en-US")}
        </p>
        <span>Available Balance</span>
      </div>
    </Link>
  );
};
export const RubaWallet: React.FC<{
  wallet: CryptoAndWalletResponseType | null;
}> = ({ wallet }) => {
  return !wallet ? (
    <div className={styles.ruba}>
      <h1>Loading...</h1>
    </div>
  ) : (
    <div className={styles.ruba}>
      <div className={styles.group}>
        <span>Balance</span>
        <h1>
          {wallet.balance.toLocaleString("en-US")} {wallet.symbol.toUpperCase()}
        </h1>
        <span>
          ${(wallet.current_price * wallet.balance).toLocaleString("USA")}
        </span>
      </div>
      <div className={styles.group}>
        <span>Username</span>
        <h1>{wallet.username}</h1>
      </div>
      <div
        className={styles.group}
        onClick={(e) => {
          navigator.clipboard.writeText(wallet.address);
          const span = document.createElement("span");
          span.innerText = "copied";
          const parent = e.target as HTMLDivElement;
          parent.parentNode?.appendChild(span);
          setTimeout(() => span.remove(), 2000);
        }}
      >
        <span>Ruba Address</span>
        <h1>{wallet.address}</h1>
      </div>
    </div>
  );
};
export default WalletList;
