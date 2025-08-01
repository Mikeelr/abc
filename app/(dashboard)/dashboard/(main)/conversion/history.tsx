"use client";
import { useUserContext } from "@/app/components/js/Wrapper";
import { getRequest, postRequest } from "@/app/components/js/api_client";
import { conversionsUrl, walletsUrl } from "@/app/components/js/config";
import {
  ConversionResponseType,
  WalletResponseType,
} from "@/app/components/js/dataTypes";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

import { FcApproval } from "react-icons/fc";
import Paginate from "@/app/components/js/paginate/Paginate";
import showError from "@/app/components/js/showError";
export const ConvertHistory: React.FC<{
  conversionz: ConversionResponseType[];
  pages: number;
}> = ({ conversionz, pages }) => {
  const { user } = useUserContext();

  const [conversions, setConversions] =
    useState<ConversionResponseType[]>(conversionz);

  const fetchData = async (page: number) => {
    const { data, success } = await getRequest(
      `${conversionsUrl}?page=${page}`,
      user?.token
    );
    if (success) {
      setConversions(data.data);
    }
  };

  return (
    <div className={styles.table}>
      <h3>Conversions</h3>
      {conversions.map((tran) => (
        <div key={tran._id} className={styles.conversion}>
          <div className={styles.icon}>
            <span style={{ color: "green" }}>
              <FcApproval />
            </span>
          </div>
          <div className={styles.desc}>
            <p>
              Conversion from {tran.baseCoin.toUpperCase()} to{" "}
              {tran.newCoin.toUpperCase()}/{" "}
              {parseFloat(tran.rate.toFixed(8)).toLocaleString("en-US")}/
              {tran._id}/
              {parseFloat(tran.charge.toFixed(8)).toLocaleString("en-US")}
              {tran.baseCoin.toUpperCase()}.
            </p>
            {user?.role == 2 && <span>{tran.username.toUpperCase()}</span>}
            <span>{tran.createdAt.split("T")[0]}</span>
          </div>
          <div className={styles.info}>
            <p className={styles.amount}>
              {parseFloat((tran.amount * tran.rate).toFixed(5)).toLocaleString(
                "en-US"
              )}{" "}
              {tran.newCoin.toUpperCase()}
            </p>
            <span>
              {tran.amount.toLocaleString("en-US")}{" "}
              {tran.baseCoin.toUpperCase()}
            </span>
          </div>
        </div>
      ))}
      {conversions.length == 0 && <h1>No Recent Conversions.</h1>}
      <Paginate pages={pages} action={fetchData} />
    </div>
  );
};
export const Convert: React.FC<{
  setError: (e: string) => void;
  wallets: WalletResponseType[];
}> = ({ setError, wallets }) => {
  const { user } = useUserContext();

  const [amount, setAmount] = useState<number>(0);
  const [charge, setCharge] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [actualAmount, setActualAmount] = useState<number>(0);
  const [baseCoin, setBaseCoin] = useState<string>(wallets[0].coinName);
  const [newCoin, setNewCoin] = useState<string>(wallets[1].coinName);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadingError] = useState<string>("");

  const [walletsNoBase, setWalletsNoBase] = useState<WalletResponseType[]>([]);
  const [selWallet, setSelWallet] = useState<WalletResponseType>();

  const handleSubmit = async () => {
    setError("Please wait...");

    const { success } = await postRequest(
      conversionsUrl,
      {
        amount,
        baseCoin,
        newCoin,
      },
      user?.token
    );

    if (success) location.reload();
    showError(setError, "Success...");
  };

  const fetchRate = async () => {
    setIsLoading(true);
    setLoadingError("Please wait...");

    const { data, success, message } = await getRequest(
      `${conversionsUrl}?convert=true&amount=${amount}&baseCoin=${baseCoin}&newCoin=${newCoin}`,

      user?.token
    );

    if (success) {
      setActualAmount(() => data.actualAmount);
      setCharge(() => data.charge);
      setRate(() => data.rate);
      setIsLoading(() => false);
      setLoadingError("");
    } else {
      showError(setError, message);
      setLoadingError(message);
    }
  };

  useEffect(() => {
    const noBase = wallets.filter((wall) => wall.coinName != baseCoin);
    setWalletsNoBase(() => noBase);
    setSelWallet(() => wallets.find((wallet) => wallet.coinName == baseCoin));
    setIsLoading(() => true);
  }, [wallets, baseCoin, newCoin, amount]);

  return (
    <div className={styles.convert}>
      <h3>Converter</h3>
      <form>
        <label htmlFor="base">Convert from</label>
        <select
          id="base"
          value={`${baseCoin}`}
          onChange={(e) =>
            setBaseCoin(
              () =>
                wallets.find((wallet) => wallet.coinName == e.target.value)!
                  .coinName
            )
          }
        >
          {wallets.map((wallet) => (
            <option value={wallet.coinName} key={wallet._id}>
              {wallet.coinName.toUpperCase()} ({wallet.balance})
            </option>
          ))}
        </select>
        <label htmlFor="secCoin">Convert to</label>
        <select
          id="secCoin"
          value={`${newCoin}`}
          onChange={(e) =>
            setNewCoin(
              () =>
                walletsNoBase.find(
                  (wallet) => wallet.coinName == e.target.value
                )?.coinName || ""
            )
          }
        >
          <option value="">Select</option>
          {walletsNoBase.map((wallet) => (
            <option value={wallet.coinName} key={wallet._id}>
              {wallet.coinName.toUpperCase()} ({wallet.balance})
            </option>
          ))}
        </select>
        <label htmlFor="amount">Amount</label>
        {amount > (selWallet?.balance || 0) && (
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
          onChange={(e) => setAmount(() => parseFloat(e.target.value))}
        />
        <span className={"action2"} onClick={fetchRate}>
          Review
        </span>
        {!isLoading ? (
          <div className={styles.review}>
            <label>This conversion will cost you</label>
            <input
              type="text"
              disabled
              value={`${charge.toLocaleString(
                "USA"
              )} ${baseCoin.toUpperCase()}`}
            />
            <label>You will get</label>
            <input
              type="text"
              disabled
              value={`${(actualAmount * rate).toLocaleString(
                "USA"
              )} ${newCoin.toUpperCase()}`}
            />
          </div>
        ) : (
          <span>{loadError}</span>
        )}

        <button
          disabled={
            amount > (selWallet?.balance || 0) ||
            baseCoin.length < 1 ||
            newCoin.length < 1 ||
            isLoading ||
            amount < 0
          }
          onClick={(e) => {
            e.preventDefault();

            handleSubmit();
          }}
        >
          Convert
        </button>
      </form>
    </div>
  );
};
export default ConvertHistory;
