"use client";

import { useState } from "react";

import styles from "./styles.module.scss";
import Image from "next/image";
import { useUserContext } from "@/app/components/js/Wrapper";
import { CurrencyResponseType } from "@/app/components/js/dataTypes";
import { getRequest } from "@/app/components/js/api_client";
import { currencysUrl } from "@/app/components/js/config";
import showError from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";

export const FindMoney: React.FC<{ coin: CurrencyResponseType | null }> = ({
  coin,
}) => {
  const { user } = useUserContext();

  const [coinNumber, setCoinNumber] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [foundCoin, setFoundCoin] = useState<CurrencyResponseType | null>(coin);

  const fetchData = async (number: string, token: string = "") => {
    setError("Please wait...");

    const { data, message, success } = await getRequest(
      `${currencysUrl}?number=${number}&token=${token}`,

      user?.token
    );

    showError(setError, success ? "Genuine Currency" : message);
    setFoundCoin(data);
  };

  return (
    <div className={styles.coin}>
      <h1>Apex Bank Portal</h1>
      {foundCoin ? (
        <form>
          <div className={styles.imgBox}>
            <div className={styles.img}>
              <Image fill src={"/assets/valid.gif"} alt="" />
            </div>
          </div>
          <h1>Genuine Currency</h1>
          <h1>{foundCoin.number}</h1>
          <h1>
            {foundCoin.value >= 1 ? foundCoin.value : foundCoin.value * 100}{" "}
            {foundCoin.value >= 1 ? "RUBA" : "Dua"}
          </h1>

          <button
            onClick={(e) => {
              e.preventDefault();
              setFoundCoin(null);
              setCoinNumber(() => "");
            }}
          >
            Reset
          </button>
        </form>
      ) : (
        <form style={{ marginBottom: "50px" }}>
          <label htmlFor="CoinNumber">Currency Number</label>
          <input
            type="text"
            value={coinNumber}
            onChange={(e) => setCoinNumber(() => e.target.value)}
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              fetchData(coinNumber);
            }}
            disabled={coinNumber.length != 8}
          >
            Check Authenticity
          </button>
        </form>
      )}
      {error && <Spinner error={error} />}
    </div>
  );
};

export default FindMoney;
