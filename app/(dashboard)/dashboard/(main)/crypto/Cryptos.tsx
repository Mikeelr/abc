"use client";
import { useEffect, useState } from "react";

import styles from "./styles.module.scss";

import Link from "next/link";
import { useUserContext } from "@/app/components/js/Wrapper";
import {
  CryptoResponseType,
  UserResponseType,
} from "@/app/components/js/dataTypes";
import { uploadFile } from "@/app/components/js/firebaseconfig";
import { postRequest, putRequest } from "@/app/components/js/api_client";
import showError from "@/app/components/js/showError";
import { cryptosUrl } from "@/app/components/js/config";
import Spinner from "@/app/components/js/spinner/Spinner";
export const CreateCrypto: React.FC<{
  setError: (e: string) => void;
  users: UserResponseType[];
}> = ({ setError, users }) => {
  const { user } = useUserContext();

  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [selUser, setSelUser] = useState<UserResponseType>();
  const [endPoint, setEndPoint] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const [current_price, setCurrent_price] = useState<string>("0");
  const [crypto, setCrypto] = useState<boolean>(true);

  const handleCreate = async () => {
    setError("Please wait ...");
    const images = await uploadFile(`/cryptos/${name}`, "form");
    const { success, message } = await postRequest(
      cryptosUrl,
      {
        name,
        symbol,
        companyName: selUser?.companyName,
        endPoint,
        amount,
        image: images[0],
        current_price: parseFloat(current_price),
        crypto,
        username: selUser?.username,
      },
      user?.token
    );

    if (success) location.reload();
    showError(setError, message);
  };

  return (
    <div className={styles.box}>
      <h1>Create Crypto</h1>
      <form id="form">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(() => e.target.value)}
        />
        <label htmlFor="symbol">Symbol</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(() => e.target.value)}
        />
        <label htmlFor="current_price">Current price</label>
        <input
          type="number"
          value={current_price}
          onChange={(e) => setCurrent_price(() => e.target.value)}
        />
        <label>Quantity</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(() => parseInt(e.target.value))}
        />
        <label htmlFor="apiEndPoint">Api End Point (optional) </label>
        <input
          type="text"
          value={endPoint}
          onChange={(e) => setEndPoint(() => e.target.value)}
        />
        <label htmlFor="cryptoType">Crypto Type</label>
        <select
          value={crypto ? "true" : "false"}
          onChange={(e) => setCrypto(() => e.target.value == "true")}
        >
          <option value="true">Cryptocurrency</option>
          <option value="false">Stable Coin</option>
        </select>
        <label htmlFor="image">Coin Image</label>
        <input type="file" id="image" accept="image/*" />
        <label htmlFor="admin">Coin Administrator</label>
        <select
          value={selUser?.username || ""}
          onChange={(e) => {
            const found = users.find(
              (user) => user.username == e.target.value
            )!;
            setSelUser(() => found);
          }}
        >
          <option value="">select</option>
          {users.map((user) => (
            <option value={user.username} key={user._id}>
              {user.oNames} {user.sName}
            </option>
          ))}
        </select>
        <button
          disabled={name.length < 3 || !selUser}
          onClick={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          Add Coin
        </button>
      </form>
    </div>
  );
};
export const Cryptos: React.FC<{ cryptos: CryptoResponseType[] }> = ({
  cryptos,
}) => {
  return (
    <div className={styles.table}>
      {cryptos.length == 0 && <h1>No Cryptocurrencies created yet</h1>}
      <div className={styles.row}>
        <span>Name</span>
        <span>Admininstrator</span>
        <span>Current Price</span>
        <span>View</span>
      </div>
      {cryptos.map((crypto) => {
        return (
          <div key={crypto._id} className={styles.row}>
            <span>{crypto.name}</span>
            <span>{crypto.companyName}</span>
            <span>${crypto.current_price}</span>

            <Link
              className={"action2"}
              href={`/dashboard/crypto/${crypto._id}`}
            >
              Edit
            </Link>
          </div>
        );
      })}
    </div>
  );
};
export const UpdateCrypto: React.FC<{
  foundCrypto: CryptoResponseType;
  users: UserResponseType[];
}> = ({ foundCrypto, users }) => {
  const { user } = useUserContext();

  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [endPoint, setEndPoint] = useState<string>("");
  const [current_price, setCurrent_price] = useState<number>(0);
  const [crypto, setCrypto] = useState<boolean>(true);
  const [selUser, setSelUser] = useState<UserResponseType>();

  const handleUpdate = async () => {
    setError("Please wait ...");
    const images = await uploadFile(`/cryptos/${name}`, "form");
    const { success, message } = await putRequest(
      `${cryptosUrl}${foundCrypto?._id}`,
      {
        owner: selUser?.cryptoCompany || selUser?.companyName,
        endPoint,
        image: images[0],

        crypto,
        username: selUser?.username,
      },
      user?.token
    );

    if (success) location.replace("/dashboard/crypto");
    showError(setError, message);
  };

  useEffect(() => {
    if (foundCrypto) {
      setName(() => foundCrypto.name);
      setSymbol(() => foundCrypto.symbol);
      const found = users.find(
        (uzer) =>
          (uzer.cryptoCompany == foundCrypto.owner ||
            uzer.companyName == foundCrypto.owner) &&
          uzer.role > 0
      );
      setSelUser(() => found);

      setEndPoint(() => `${foundCrypto.endPoint || ""}`);
      setCurrent_price(() => foundCrypto.current_price);
      setCrypto(() => foundCrypto.crypto);
    }
  }, [foundCrypto?._id]);

  return (
    <div className={styles.crypto}>
      <h1>Update Crypto {foundCrypto.name}</h1>
      <div className={styles.box}>
        <form id="form">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => null}
            disabled={true}
          />
          <label htmlFor="symbol">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => null}
            disabled={true}
          />
          <label htmlFor="current_price">Current price</label>
          <input
            type="number"
            value={current_price}
            disabled
            onChange={(e) => null}
          />
          <label htmlFor="apiEndPoint">Api End Point</label>
          <input
            type="text"
            value={endPoint}
            onChange={(e) => setEndPoint(() => e.target.value)}
          />
          <label htmlFor="cryptoType">Crypto Type</label>
          <select
            value={crypto ? "true" : "false"}
            onChange={(e) => setCrypto(() => e.target.value == "true")}
          >
            <option value="true">Cryptocurrency</option>
            <option value="false">Stable Coin</option>
          </select>
          <label htmlFor="image">Coin Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            aria-describedby={`${foundCrypto?.image}`}
          />
          <label htmlFor="admin">Coin Administrator</label>
          <select
            value={selUser?.username || ""}
            disabled={foundCrypto.symbol == "ruba"}
            onChange={(e) => {
              const found = users.find(
                (user) => user.username == e.target.value
              )!;

              setSelUser(() => found);
            }}
          >
            <option value="">Select</option>
            {users.map((user) => (
              <option value={user.username} key={user._id}>
                {user.oNames} {user.sName}
              </option>
            ))}
          </select>
          <button
            disabled={name.length < 3 || !selUser}
            onClick={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            Update Coin
          </button>
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};

export default Cryptos;
