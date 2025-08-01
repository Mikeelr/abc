"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import {
  BankInfoResponseType,
  WalletResponseType,
} from "@/app/components/js/dataTypes";
import BasicData, { API, BankInfo } from "./Account";
import Spinner from "@/app/components/js/spinner/Spinner";
import { useUserContext } from "@/app/components/js/Wrapper";
export default function Body({
  wallets,
  accounts,
}: {
  wallets: WalletResponseType[];
  accounts: BankInfoResponseType[];
}) {
  const [error, setError] = useState<string>("");
  const { user } = useUserContext();
  return (
    <div className={styles.account}>
      <BasicData setError={setError} />
      {(user?.role || 0) > 0 && <API setError={setError} />}
      <BankInfo walletz={wallets} accounts={accounts} setError={setError} />
      {error && <Spinner error={error} />}
    </div>
  );
}
