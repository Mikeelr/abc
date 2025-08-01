"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import Spinner from "@/app/components/js/spinner/Spinner";
import ConvertHistory, { Convert } from "./history";
import {
  ConversionResponseType,
  WalletResponseType,
} from "@/app/components/js/dataTypes";
export default function Body({
  wallets,
  conversions,
  convertPages,
}: {
  wallets: WalletResponseType[];
  conversions: ConversionResponseType[];
  convertPages: number;
}) {
  const [error, setError] = useState<string>("");
  return (
    <div className={styles.conversions}>
      <h1>Conversion</h1>
      <div className={styles.grid}>
        <Convert setError={setError} wallets={wallets} />
        <ConvertHistory conversionz={conversions} pages={convertPages} />
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
}
