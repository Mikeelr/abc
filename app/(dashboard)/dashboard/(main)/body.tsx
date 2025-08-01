"use client";
import {
  CryptoAndWalletResponseType,
  TransactionResponseType,
} from "@/app/components/js/dataTypes";
import styles from "../styles.module.scss";
import WalletList, { RubaWallet } from "./Wallet";
import TransactionList from "./transactions/body";
export default function Body({
  token,
  transactions,
  wallets,
  ruba,
  pages,
}: {
  token: string;
  wallets: CryptoAndWalletResponseType[];
  ruba: CryptoAndWalletResponseType;
  transactions: TransactionResponseType[];
  pages: number;
}) {
  return (
    <div className={styles.main}>
      <div className={styles.index}>
        <div>
          <RubaWallet wallet={ruba} />
        </div>
        <div>
          <WalletList wallets={wallets} />
        </div>
        <div>
          <TransactionList transactionz={transactions} pages={pages} />
        </div>
      </div>
    </div>
  );
}
