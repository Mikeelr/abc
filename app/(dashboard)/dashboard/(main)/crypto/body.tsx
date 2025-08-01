"use client";
import { useState } from "react";
import Cryptos, { CreateCrypto } from "./Cryptos";
import styles from "./styles.module.scss";
import Spinner from "@/app/components/js/spinner/Spinner";
import {
  CryptoResponseType,
  UserResponseType,
} from "@/app/components/js/dataTypes";
export default function Body({
  users,
  cryptos,
}: {
  users: UserResponseType[];
  cryptos: CryptoResponseType[];
}) {
  const [error, setError] = useState<string>("");
  return (
    <div className={styles.crypto}>
      <h1>Manage Cryptocurrencies</h1>
      <div className={styles.container}>
        <CreateCrypto setError={setError} users={users} />
        <Cryptos cryptos={cryptos} />
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
}
