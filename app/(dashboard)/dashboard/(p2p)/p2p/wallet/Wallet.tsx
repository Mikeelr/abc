"use client";

import { useEffect, useState } from "react";

import styles from "./styles.module.scss";

import Link from "next/link";
import Image from "next/image";
import {
  P2PWalletType,
  WalletResponseType,
} from "@/app/components/js/dataTypes";
import { useUserContext } from "@/app/components/js/Wrapper";
import { p2pWalletsUrl, walletsUrl } from "@/app/components/js/config";
import { getRequest, putRequest } from "@/app/components/js/api_client";
import showError from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";

export const Wallets: React.FC<{ wallets: P2PWalletType[] }> = ({
  wallets,
}) => {
  return (
    <div className={styles.wallets}>
      <Link href={"/dashboard/p2p/wallet/transfer"} className={"action2"}>
        Transfer
      </Link>
      <div className={styles.table}>
        {wallets.map((wallet) => (
          <div className={styles.wallet} key={wallet.coinName}>
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
                $
                {(wallet.current_price * wallet.balance).toLocaleString(
                  "en-US"
                )}
              </p>
              <p className={styles.sm}>
                {wallet.coinName.toUpperCase()} {wallet.balance}
              </p>
              <span>Available Balance</span>
              <p className={styles.sm}>
                {wallet.coinName.toUpperCase()} {wallet.pending}
              </p>
              <span>Pending Balance</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export const ConvertWallet: React.FC = () => {
  const { user } = useUserContext();

  const [p2pWallets, setP2pWallets] = useState<P2PWalletType[]>([]);
  const [wallets, setWallets] = useState<WalletResponseType[]>([]);

  const [error, setError] = useState<string>("");
  const [coinName, setCoinName] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [toP2P, setToP2P] = useState<boolean>(true);

  const fetchData = async () => {
    const { data: p2pw } = await getRequest(
      `${p2pWalletsUrl}?onlyWallet=true`,

      user?.token
    );
    const { data } = await getRequest(
      walletsUrl,

      user?.token
    );

    setP2pWallets(() => p2pw?.data || []);
    setCoinName((e) => p2pw?.data[0].coinName || e);
    setWallets(() => data?.data || []);
  };

  const handleTransfer = async () => {
    setError("Please wait...");
    const { message, success } = await putRequest(
      `${p2pWalletsUrl}9933838`,
      { coinName, amount, type: toP2P ? 1 : 0 },

      user?.token
    );
    showError(setError, message);

    success && location.replace("/dashboard/p2p/wallet");
  };
  useEffect(() => {
    if (user?.token) {
      fetchData();
    }
  }, [user?.token]);
  useEffect(() => {
    if (toP2P) {
      const found = wallets.find((wallet) => wallet.coinName == coinName);
      setBalance(() => found?.balance || 0);
    } else {
      const found = p2pWallets.find((wallet) => wallet.coinName == coinName);
      setBalance(() => found?.balance || 0);
    }
  }, [coinName, toP2P]);

  return (
    <div className={styles.wallets}>
      <h1>Transfer Between Wallets</h1>
      <div className={styles.box}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTransfer();
          }}
        >
          <select
            value={toP2P ? "true" : "false"}
            onChange={(e) => {
              setToP2P(() => e.target.value == "true");
            }}
          >
            <option value={"true"}>From Main Wallet to P2P Wallet</option>
            <option value={"false"}>From P2P Wallet to Main Wallet</option>
          </select>
          <label htmlFor="">Select Wallet</label>
          <select
            value={coinName}
            onChange={(e) => {
              setCoinName(() => e.target.value);
            }}
          >
            {p2pWallets.map((wallet) => (
              <option value={wallet.coinName} key={wallet.coinName}>
                {wallet.coinName.toUpperCase()}
              </option>
            ))}
          </select>
          <h1>
            {balance.toLocaleString("en-US")} {coinName.toUpperCase()}
          </h1>
          <label htmlFor="">Enter Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(() => parseFloat(e.target.value))}
          />
          <button
            disabled={amount > balance || (amount || 0) <= 0 || !coinName}
          >
            Transfer
          </button>
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};
