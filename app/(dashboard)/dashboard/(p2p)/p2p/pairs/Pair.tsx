"use client";

import { useEffect, useState } from "react";

import styles from "./styles.module.scss";
import Link from "next/link";
import Spinner from "@/app/components/js/spinner/Spinner";
import { useUserContext } from "@/app/components/js/Wrapper";
import {
  AcceptedCoinType,
  P2PPairResponseType,
} from "@/app/components/js/dataTypes";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/app/components/js/api_client";
import { p2pPairsUrl } from "@/app/components/js/config";
import showError from "@/app/components/js/showError";
import Paginate from "@/app/components/js/paginate/Paginate";

export const Pairs: React.FC<{ setError: (e: string) => void }> = ({
  setError,
}) => {
  const { user } = useUserContext();

  const [pairs, setPairs] = useState<P2PPairResponseType[]>([]);
  const [pages, setPages] = useState<number>(1);

  const fetchData = async (page: number = 1) => {
    const { data } = await getRequest(
      `${p2pPairsUrl}?page=${page}`,

      user?.token
    );
    setPairs((e) => data?.data || e);
    setPages(data?.pages || 0);
  };
  const handleDelete = async (id: string) => {
    setError("Please wait...");
    const { success, message } = await deleteRequest(
      `${p2pPairsUrl}${id}`,

      user?.token
    );
    setPairs((e) => (success ? e.filter((pair) => pair._id != id) : e));
    showError(setError, message);
  };

  useEffect(() => {
    if (user?.token) {
      fetchData();
    }
  }, [user?.token]);

  return (
    <div className={styles.table}>
      <h1>Available Pairs</h1>
      {pairs.length < 1 && <h3>No Pair found!</h3>}

      <div className={styles.row}>
        <span>Pair</span>
        <span>Edit</span>
        <span>Delete</span>
      </div>
      {pairs.map((pair) => (
        <div className={styles.row} key={pair._id}>
          <span>
            {pair.baseCoin.toUpperCase()} &lt;=&gt;
            {pair.newCoin.toUpperCase()}
          </span>
          <Link href={`/dashboard/p2p/pairs/${pair._id}`} className={"action2"}>
            Edit
          </Link>
          <span onClick={(e) => handleDelete(pair._id)} className={"action2"}>
            Delete
          </span>
        </div>
      ))}
      <Paginate pages={pages} action={fetchData} />
    </div>
  );
};
export const CreatePair: React.FC<{ setError: (e: string) => void }> = ({
  setError,
}) => {
  const { user } = useUserContext();

  const [baseCoins, setBaseCoins] = useState<AcceptedCoinType[]>([]);

  const [baseCoin, setBaseCoin] = useState<string>("");
  const [newCoin, setNewCoin] = useState<string>("");

  const fetchData = async () => {
    const { data } = await getRequest(
      `${p2pPairsUrl}?baseCoin=true`,
      user?.token
    );

    if (data) {
      setBaseCoins(() => data.data);
      setBaseCoin(() => data.data[0]?.symbol || "");
    }
  };

  const handleCreate = async () => {
    setError("Please wait...");
    const { message, success } = await postRequest(
      p2pPairsUrl,
      { baseCoin, newCoin },

      user?.token
    );
    showError(setError, message);

    success && location.reload();
  };
  useEffect(() => {
    if (user?.token) {
      fetchData();
    }
  }, [user?.token]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreate();
      }}
    >
      <label htmlFor="">Coin 1</label>
      <select
        value={baseCoin}
        onChange={(e) => {
          setBaseCoin(() => e.target.value);
        }}
      >
        <option value={""}>Select</option>
        {baseCoins.map((coin) => (
          <option value={coin.symbol} key={coin.symbol}>
            {coin.name}
          </option>
        ))}
      </select>
      <label htmlFor="">Coin 2</label>
      <select
        value={newCoin}
        onChange={(e) => setNewCoin(() => e.target.value)}
      >
        <option value={""}>Select</option>
        {baseCoins
          .filter((e) => e.symbol != baseCoin)
          .map((coin) => (
            <option value={coin.symbol} key={coin.symbol}>
              {coin.name}
            </option>
          ))}
      </select>

      <button>Add Pair</button>
    </form>
  );
};
export const UpdatePair: React.FC<{
  pair: P2PPairResponseType;
  baseCoins: AcceptedCoinType[];
}> = ({ pair: foundPair, baseCoins }) => {
  const { user } = useUserContext();

  const [error, setError] = useState<string>("");
  const [baseCoin, setBaseCoin] = useState<string>("");
  const [newCoin, setNewCoin] = useState<string>("");

  const handleUpdate = async () => {
    setError("Please wait...");
    const { message, success } = await putRequest(
      `${p2pPairsUrl}${foundPair?._id}`,
      { baseCoin, newCoin },

      user?.token
    );
    showError(setError, message);

    success && location.replace("/dashboard/p2p/pairs");
  };
  const handleDelete = async () => {
    setError("Please wait...");
    const { message, success } = await deleteRequest(
      `${p2pPairsUrl}${foundPair?._id}`,

      user?.token
    );
    showError(setError, message);

    success && location.replace("/dashboard/p2p/pairs");
  };

  useEffect(() => {
    if (foundPair) {
      setBaseCoin(() => foundPair.baseCoin);
      setNewCoin(() => foundPair.newCoin);
    }
  }, [foundPair?._id]);

  return (
    <div className={styles.pairs}>
      <div className={styles.box}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="">Coin 1</label>
          <select
            value={baseCoin}
            onChange={(e) => {
              setBaseCoin(() => e.target.value);
            }}
          >
            <option value={""}>Select</option>
            {baseCoins.map((coin) => (
              <option value={coin.symbol} key={coin.symbol}>
                {coin.name}
              </option>
            ))}
          </select>
          <label htmlFor="">Coin 2</label>
          <select
            value={newCoin}
            onChange={(e) => setNewCoin(() => e.target.value)}
          >
            <option value={""}>Select</option>
            {baseCoins
              .filter((e) => e.symbol != baseCoin)
              .map((coin) => (
                <option value={coin.symbol} key={coin.symbol}>
                  {coin.name}
                </option>
              ))}
          </select>
          <button
            onClick={() => {
              handleUpdate();
            }}
          >
            Update Pair
          </button>
          <button
            onClick={() => {
              handleDelete();
            }}
          >
            Delete Pair
          </button>
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};
export const PairsBody = () => {
  const [error, setError] = useState<string>("");
  return (
    <div className={styles.pairs}>
      <h1>Manage Pairs</h1>
      <div className={styles.container}>
        <CreatePair setError={setError} />
        <Pairs setError={setError} />
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};
