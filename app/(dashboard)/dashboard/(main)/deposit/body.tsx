"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./styles.module.scss";
import {
  ACCEPTEDCOINS,
  AcceptedCoinType,
  WalletResponseType,
} from "@/app/components/js/dataTypes";
import { useUserContext } from "@/app/components/js/Wrapper";
import { postRequest } from "@/app/components/js/api_client";
import { transactionsUrl } from "@/app/components/js/config";
import showError from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";

export const Body: React.FC<{ adminWallets: WalletResponseType[] }> = ({
  adminWallets,
}) => {
  const { user } = useUserContext();

  const [amount, setAmount] = useState<number>(15);
  const [error, setError] = useState<string>("");
  const [selCoin, setSelCoin] = useState<AcceptedCoinType>(ACCEPTEDCOINS[3]);
  const [adminWallet, setAdminWallet] = useState<WalletResponseType | null>(
    adminWallets.find((e) => e.coinName == ACCEPTEDCOINS[3].symbol) || null
  );
  const [channel, setChannel] = useState<number>(0);
  const [senderWalletAddress, setSenderWalletAddress] = useState<string>("");

  const router = useRouter();
  useEffect(() => {
    const found = adminWallets.find((e) => e.coinName == selCoin.symbol);
    setAdminWallet(found || null);
  }, [selCoin.symbol]);

  const handleSubmit = async () => {
    setError("Please wait...");
    const adminWallet = adminWallets.find((e) => e.coinName == selCoin.symbol);
    const { data, success, message } = await postRequest(
      transactionsUrl,
      {
        amount,
        coinName: selCoin.symbol,
        channel,
        type: 1,
        receiverWalletAddress: adminWallet?.address,
        senderWalletAddress,
        network: selCoin.network,
      },
      user?.token
    );
    if (!success) {
      showError(setError, message);
      return;
    }
    if (channel == 0) {
      router.replace("/dashboard/transactions");
      showError(setError, "Success...");
    } else {
      showError(setError, "Please wait, redirecting to payment gateway...");
      window.open(data.url);
    }
  };

  return (
    <div className={styles.deposit}>
      <form>
        <h1>Fund Wallet</h1>
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(() => parseFloat(e.target.value))}
        />

        <label htmlFor="SelCoin">Select Crypto Asset</label>
        <select
          id="SelCoin"
          value={selCoin.symbol}
          onChange={(e) =>
            setSelCoin(
              () => ACCEPTEDCOINS.find((coin) => coin.symbol == e.target.value)!
            )
          }
        >
          {ACCEPTEDCOINS.map((coin) => (
            <option value={coin.symbol} key={coin._id}>
              {coin.name}
            </option>
          ))}
        </select>
        <label htmlFor="network">Network</label>
        <input type="text" id="network" value={selCoin.network} disabled />
        <label htmlFor="senderWalletAddress">Sender Wallet Address</label>
        <input
          type="text"
          value={senderWalletAddress}
          onChange={(e) => setSenderWalletAddress(() => e.target.value)}
        />

        <div className={styles.row} style={{ width: "100%", gap: "20px" }}>
          {/* <button
              onClick={(e) => {
                e.preventDefault();
                setChannel(() => 1);
                handleSubmit();
              }}
              style={{ flex: "1" }}
            >
              Gateway Payment
            </button> */}
          {channel != 0 && (
            <button
              disabled={senderWalletAddress.length < 15 || amount < 0}
              onClick={(e) => {
                e.preventDefault();
                setChannel(() => 0);
              }}
            >
              Manual Payment
            </button>
          )}
        </div>
        {channel == 0 && (
          <div className={styles.column}>
            <p>
              Send exactly{" "}
              <b>
                {amount} {selCoin.symbol.toUpperCase()} to{" "}
                {adminWallet?.address}.{" "}
              </b>
            </p>
            <p>
              After sending click the sent button and wait for confirmation.
            </p>
            <span
              onClick={(e) => {
                navigator.clipboard.writeText(adminWallet?.address || "");
                const target = e.target as HTMLSpanElement;
                target.innerText = "Copied!";
              }}
              className={"action2"}
            >
              Copy Wallet address
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                setChannel(() => 0);
                handleSubmit();
              }}
              disabled={amount < 0}
            >
              Sent
            </button>
          </div>
        )}
      </form>
      {error && <Spinner error={error} />}
    </div>
  );
};

export default Body;
