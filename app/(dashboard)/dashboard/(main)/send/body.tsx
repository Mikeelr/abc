"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./styles.module.scss";
import { useUserContext } from "@/app/components/js/Wrapper";
import { WalletResponseType } from "@/app/components/js/dataTypes";
import { postRequest } from "@/app/components/js/api_client";
import { transactionsUrl } from "@/app/components/js/config";
import showError from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";
import Link from "next/link";

export const Send: React.FC<{ wallets: WalletResponseType[] }> = ({
  wallets,
}) => {
  const { user } = useUserContext();

  const [amount, setAmount] = useState<string>("0");
  const [selWallet, setSelWallet] = useState<WalletResponseType>();

  const [network, setNetwork] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [internalTran, setInternalTran] = useState<boolean>(true);
  const [receiverWalletAddress, setReceiverWalletAddress] =
    useState<string>("");

  const router = useRouter();

  const handleSubmit = async () => {
    setError("Please wait...");

    const { success, message } = await postRequest(
      transactionsUrl,
      {
        amount: parseFloat(amount),
        coinName: selWallet?.coinName,

        type: 0,
        receiverWalletAddress,
        senderWalletAddress: selWallet?.address,
        network,
        internalTran,
      },
      user?.token
    );

    if (!success) {
      showError(setError, message);
      return;
    }
    router.replace("/dashboard/transactions");
  };

  return (
    <div className={styles.send}>
      <h1>Send</h1>
      <div className={styles.center}>
        <span className={styles.atn}>Channel</span>
        <div className={styles.buttons}>
          <span
            className={internalTran ? styles.active : ""}
            onClick={() => setInternalTran(true)}
          >
            Local Network
          </span>
          <span
            className={!internalTran ? styles.active : ""}
            onClick={() => setInternalTran(false)}
          >
            Blockchain
          </span>
        </div>
      </div>
      <form>
        {!user?.verified && (
          <p className={styles.atn}>
            Please complete{" "}
            <Link href={"/dashboard/kyc"}>KYC registration</Link> to continue!
          </p>
        )}
        <label htmlFor="SelWallet">Choose wallet to send from</label>
        <select
          id="SelWallet"
          value={`${selWallet?._id}`}
          onChange={(e) =>
            setSelWallet(
              () => wallets.find((wallet) => wallet._id == e.target.value)!
            )
          }
        >
          <option value="">Select</option>
          {wallets.map((wallet) => (
            <option value={wallet._id} key={wallet._id}>
              {wallet.coinName.toUpperCase()} ({wallet.balance})
            </option>
          ))}
        </select>
        <label htmlFor="amount">Amount</label>
        {parseFloat(amount) > (selWallet?.balance || 0) && (
          <span style={{ color: "red" }}>
            Insufficient balance.{" "}
            <b>
              Your {selWallet?.coinName.toUpperCase()} balance is{" "}
              {selWallet?.balance.toLocaleString("USA")}{" "}
              {selWallet?.coinName.toUpperCase()}
            </b>
          </span>
        )}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(() => e.target.value)}
        />

        {!internalTran && <label htmlFor="network">Network</label>}
        {!internalTran && (
          <input
            type="text"
            id="network"
            value={network}
            onChange={(e) => setNetwork(() => e.target.value)}
          />
        )}
        <label htmlFor="ReceiverWalletAddress">Reciever Wallet Address</label>
        {internalTran && (
          <span className={styles.atn}>Enter recipient wallet ID</span>
        )}
        <input
          type="text"
          value={receiverWalletAddress}
          onChange={(e) => setReceiverWalletAddress(() => e.target.value)}
        />
        <button
          disabled={
            parseFloat(amount) > (selWallet?.balance || 0) ||
            receiverWalletAddress.length < 9 ||
            parseFloat(amount) < 0 ||
            !user?.verified
          }
          onClick={(e) => {
            e.preventDefault();

            handleSubmit();
          }}
        >
          Send Now
        </button>
      </form>
      {error && <Spinner error={error} />}
    </div>
  );
};

export default Send;
