"use client";
import { useState, useEffect } from "react";
import { CryptoResponseType } from "../dataTypes";
import styles from "./Curve.module.scss";
import { TbArrowUpRightCircle, TbArrowDownRightCircle } from "react-icons/tb";
import { getRequest } from "../api_client";
import { cryptosUrl } from "../config";

const months: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const CoinPriceTicker: React.FC<{ coinName?: string; id: string }> = ({
  coinName,
  id,
}) => {
  const [high, setHigh] = useState<{ date: string; price: number }>();
  const [low, setLow] = useState<{ date: string; price: number }>();

  const [data, setData] = useState<{ date: string; price: number }[]>([]);
  const [crypto, setCrypto] = useState<CryptoResponseType | null>(null);
  const [refetch, setRefetch] = useState<boolean>(true);
  const fetchData = async () => {
    try {
      const { data, success } = await getRequest(
        `${cryptosUrl}${id}?coinName=${coinName}`
      );
      if (!success) throw new Error("Failed");
      setCrypto(data.data);
      const values: { date: string; price: number }[] = [];
      data.chart.prices.forEach((price: number[]) => {
        const date = `${new Date(price[0]).getUTCDate()} ${
          months[new Date(price[0]).getMonth()]
        } ${new Date(price[0]).getHours()}:${new Date(price[0]).getMinutes()}`;
        values.push({ date, price: price[1] });
      });
      setData(() => values);
      const v1 = [...values];
      v1.sort((a, b) => b.price - a.price);

      setHigh(v1[0]);
      setLow(v1[v1.length - 1]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (refetch) {
      fetchData();
      setRefetch(() => false);
    } else {
      setTimeout(() => setRefetch(() => true), 3000 * 60);
    }
  }, [coinName, id, refetch]);
  useEffect(() => {
    const box = document.querySelector("#box") as HTMLDivElement;
    const deviceWidth = window.innerWidth;
    const width = box.getBoundingClientRect().width - deviceWidth;
    const time = width / 20;
    box.style.setProperty("--length", `-${width}px`);
    box.style.setProperty("--time", `${time}s`);
  }, [data]);
  return (
    <div className={styles.curve}>
      <div className={styles.left}>
        <div>
          <span>{crypto?.name} PRICE FOR THE LAST 24 hours</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.notices}>
          <div className={styles.notice}>
            <span>${low?.price.toLocaleString("USA")}</span>
            <span>{low?.date}</span>
            <span>24h Low</span>
          </div>
          <div className={styles.notice}>
            <span>${high?.price.toLocaleString("USA")}</span>
            <span>{high?.date}</span>
            <span>24h High</span>
          </div>
        </div>
        <div className={styles.box} id="box">
          {data.map((day, i) => (
            <div key={i} className={styles.child}>
              <span
                className={
                  data[i].price > (data[i - 1]?.price || data[i].price)
                    ? styles.up
                    : styles.down
                }
              >
                ${day.price.toLocaleString("USA")}{" "}
                {data[i].price > (data[i - 1]?.price || data[i].price) ? (
                  <TbArrowUpRightCircle />
                ) : (
                  <TbArrowDownRightCircle />
                )}
              </span>
              <span>{day.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoinPriceTicker;
