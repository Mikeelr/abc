"use client";
import { useEffect, useState } from "react";

import styles from "./styles.module.scss";
import Link from "next/link";
import { useUserContext } from "@/app/components/js/Wrapper";
import {
  P2PMarketResponseType,
  P2PPairResponseType,
} from "@/app/components/js/dataTypes";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/app/components/js/api_client";
import { p2pMarketsUrl, p2pPairsUrl } from "@/app/components/js/config";
import showError from "@/app/components/js/showError";
import Paginate from "@/app/components/js/paginate/Paginate";
import Spinner from "@/app/components/js/spinner/Spinner";

export const AllMarkets: React.FC = () => {
  const { user } = useUserContext();

  const [markets, setMarkets] = useState<P2PMarketResponseType[]>([]);
  const [pages, setPages] = useState<number>(1);
  const [type, setType] = useState<string>("1");
  const [error, setError] = useState<string>("");
  const [pairs, setPairs] = useState<P2PPairResponseType[]>([]);
  const [pair, setPair] = useState<P2PPairResponseType>();

  const fetchMarkets = async (page: number = 1) => {
    const { data, success } = await getRequest(
      `${p2pMarketsUrl}?page=${page}&type=${type}&baseCoin=${pair?.baseCoin}&newCoin=${pair?.newCoin}`,

      user?.token
    );
    if (success) {
      data.data.sort((a: P2PMarketResponseType, b: P2PMarketResponseType) =>
        type == "1" ? b.rate - a.rate : a.rate - b.rate
      );

      setMarkets(() => data.data);
      setPages(data.pages);
    }
  };
  const fetchPairs = async () => {
    const { data, success } = await getRequest(
      `${p2pPairsUrl}?page=1&perPage=150`,
      user?.token
    );
    if (success) {
      setPairs(() => data.data);
      setPair(() => data.data[0]);
    }
  };
  const handleDelete = async (id: string) => {
    setError("Please wait...");
    const { success, message } = await deleteRequest(
      `${p2pMarketsUrl}${id}`,

      user?.token
    );

    showError(setError, message);
    if (success) setMarkets((e) => e.filter((market) => market._id != id));
  };
  useEffect(() => {
    if (user?.token) {
      fetchPairs();
    }
  }, [user?.token]);
  useEffect(() => {
    if (user?.token && pair?.baseCoin) {
      fetchMarkets();
    }
  }, [pair?.baseCoin, pair?.newCoin, type, user?.token]);

  return (
    <div className={styles.markets}>
      <div className={styles.container} style={{ flexDirection: "row" }}>
        <select
          value={pair?._id ? pair._id : ""}
          onChange={(e) =>
            setPair(() => pairs.find((pa) => pa._id == e.target.value))
          }
        >
          {pairs.map((pair) => (
            <option value={pair._id} key={pair._id}>
              {pair.baseCoin.toUpperCase() + "<=>" + pair.newCoin.toUpperCase()}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType((v) => e.target.value || v)}
        >
          <option value={"0"}>Buy</option>
          <option value={"1"}>Sell</option>
        </select>
      </div>

      {markets.length == 0 && (
        <h1>
          No ads available for selected pair, Please select other pair options
        </h1>
      )}
      <div className={styles.grid}>
        {markets.map((market) => {
          return (
            <div className={styles.market} key={market._id}>
              <h3>
                {market.baseCoin.toUpperCase() +
                  "<=>" +
                  market.newCoin.toUpperCase()}
              </h3>
              <div>
                <span>Rate</span>
                <p>
                  {market.rate.toLocaleString("USA")}{" "}
                  {market.newCoin.toUpperCase()}
                </p>
              </div>
              <div>
                <span>Amount</span>
                <p>
                  {market.amount.toLocaleString("USA")}{" "}
                  {market.baseCoin.toUpperCase()}
                </p>
              </div>
              <div>
                <span>Dealer</span>
                <p>{market.username.toUpperCase()}</p>
              </div>
              <p>___________________</p>
              <div>
                <p>{market.type == 1 ? "Buy Ads" : "Sell Ads"}</p>
              </div>

              <Link
                href={`/dashboard/p2p/orders/order?id=${market._id}`}
                className={"action2"}
              >
                Details
              </Link>
              {user?.role == 2 && (
                <span
                  onClick={() => handleDelete(market._id)}
                  className={"action2"}
                >
                  Delete Ads
                </span>
              )}
            </div>
          );
        })}

        {error && <Spinner error={error} />}
        <Paginate pages={pages} action={fetchMarkets} />
      </div>
    </div>
  );
};
export const Markets: React.FC<{ setError: (e: string) => void }> = ({
  setError,
}) => {
  const { user } = useUserContext();

  const [markets, setMarkets] = useState<P2PMarketResponseType[]>([]);
  const [pages, setPages] = useState<number>(0);

  const fetchData = async (page: number = 1) => {
    const { data } = await getRequest(
      `${p2pMarketsUrl}?page=${page}&username=${user?.username}`,

      user?.token
    );
    if (data) {
      setMarkets(() => data.data);
      setPages(data.pages);
    }
  };
  const handleDelete = async (id: string) => {
    setError("Please wait...");
    const { message, success } = await deleteRequest(
      `${p2pMarketsUrl}${id}`,

      user?.token
    );
    success && setMarkets((e) => e.filter((market) => market._id != id));
    showError(setError, message);
  };

  useEffect(() => {
    if (user?.token) {
      fetchData();
    }
  }, [user?.token]);

  return (
    <div className={styles.table}>
      <h1>All Ads</h1>
      {markets.length < 1 && <h3>You have not posted any Ads yet!</h3>}

      <div className={styles.row}>
        <span>Pair</span>
        <span>Rate</span>
        <span>Amount</span>
        <span>Type</span>
        <span>Visibility</span>
        <span>Edit</span>
        <span>Delete</span>
      </div>
      {markets.map((market) => (
        <div className={styles.row} key={market._id}>
          <span>
            {market.baseCoin.toUpperCase()} &lt;=&gt;
            {market.newCoin.toUpperCase()}
          </span>
          <span>{market.rate.toLocaleString("en-US")}</span>
          <span>{market.amount.toLocaleString("en-US")}</span>
          <span>{market.type == 0 ? "Sell" : "Buy"}</span>
          <span>{market.active ? "Visible" : "Hidden"}</span>
          <Link href={`/dashboard/p2p/ad/${market._id}`} className={"action2"}>
            Edit
          </Link>
          <span onClick={(e) => handleDelete(market._id)} className={"action2"}>
            Delete
          </span>
        </div>
      ))}
      <Paginate pages={pages} action={fetchData} />
    </div>
  );
};
export const CreateMarket: React.FC<{ setError: (e: string) => void }> = ({
  setError,
}) => {
  const { user } = useUserContext();

  const [tel, setTel] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [pairs, setPairs] = useState<P2PPairResponseType[]>([]);
  const [pair, setPair] = useState<P2PPairResponseType>();

  const fetchData = async () => {
    const { data, success } = await getRequest(
      p2pPairsUrl,

      user?.token
    );

    if (success) {
      setPairs(() => data.data);
      setPair(() => data.data[0]);
    }
  };

  const handleCreate = async (buy: boolean) => {
    setError("Please wait...");
    const { message, success } = await postRequest(
      p2pMarketsUrl,
      { pairId: pair?._id, amount, rate, type: buy ? 1 : 0, tel },

      user?.token
    );
    success && location.reload();
    showError(setError, message);
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
      }}
    >
      <h1>Create Ads</h1>
      <label htmlFor="">Select Pair</label>
      <select
        value={pair?._id || ""}
        onChange={(e) => {
          setPair(() => pairs.find((pair) => pair._id == e.target.value));
        }}
      >
        {pairs.map((pair) => (
          <option value={pair._id} key={pair._id}>
            {pair.baseCoin.toUpperCase()}&lt;=&gt;
            {pair.newCoin.toUpperCase()}
          </option>
        ))}
      </select>
      <label htmlFor="">Amount</label>
      <input
        value={amount}
        type="number"
        onChange={(e) => setAmount(() => parseFloat(e.target.value))}
      />
      <label htmlFor="">Rate</label>
      <input
        value={rate}
        type="number"
        onChange={(e) => setRate(() => parseFloat(e.target.value))}
      />
      <label htmlFor="">Your Phone Number</label>
      <input
        value={tel}
        name="tel"
        type="text"
        onChange={(e) => setTel(() => e.target.value)}
      />
      <button
        onClick={(e) => {
          handleCreate(true);
        }}
        disabled={!amount || amount <= 0 || tel.length < 8}
      >
        Place Buy Ad
      </button>
      <button
        onClick={(e) => {
          handleCreate(false);
        }}
        disabled={!amount || amount <= 0 || tel.length < 8}
      >
        Place Sell Ad
      </button>
    </form>
  );
};
export const AdsBody = () => {
  const [error, setError] = useState<string>("");
  return (
    <div className={styles.markets}>
      <div className={styles.container}>
        <CreateMarket setError={setError} />
        <Markets setError={setError} />
      </div>

      {error && <Spinner error={error} />}
    </div>
  );
};
export const UpdateMarket: React.FC<{ market: P2PMarketResponseType }> = ({
  market: foundMarket,
}) => {
  const { user } = useUserContext();

  const [rate, setRate] = useState<number>(0);
  const [active, setActive] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    setAmount(() => foundMarket.amount);
    setRate(() => foundMarket.rate);
    setActive(() => foundMarket.active);
  }, [foundMarket._id]);

  const handleUpdate = async () => {
    setError("Please wait...");
    const { success, message } = await putRequest(
      `${p2pMarketsUrl}${foundMarket?._id}`,
      { amount, rate, active },

      user?.token
    );
    showError(setError, message);

    success && location.replace("/dashboard/p2p/ad");
  };
  const handleDelete = async () => {
    setError("Please wait...");
    const { message, success } = await deleteRequest(
      `${p2pMarketsUrl}${foundMarket?._id}`,

      user?.token
    );

    showError(setError, message);
    success && location.replace("/dashboard/p2p/ad");
  };

  return (
    <div className={styles.markets}>
      <h1>Update P2P Order</h1>
      <div className={styles.box}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="">Pair</label>
          <input
            value={
              foundMarket.baseCoin.toUpperCase() +
              "<=>" +
              foundMarket.newCoin.toUpperCase()
            }
            disabled
          />
          <label htmlFor="">Ads Type</label>
          <input value={foundMarket.type == 0 ? "Buy" : "Sell"} disabled />
          <label htmlFor="">Amount</label>
          <input
            value={amount}
            type="number"
            onChange={(e) => setAmount(() => parseFloat(e.target.value))}
          />
          <label htmlFor="">Rate</label>
          <input
            value={rate}
            type="number"
            onChange={(e) => setRate(() => parseFloat(e.target.value))}
          />
          <label htmlFor="">Visibility</label>
          <select
            value={active ? "true" : "false"}
            onChange={(e) => setActive(() => e.target.value == "true")}
          >
            <option value="true">Visible</option>
            <option value="false">Hidden</option>
          </select>
          <button
            onClick={() => {
              handleUpdate();
            }}
          >
            Update Ad
          </button>
          <button
            onClick={() => {
              handleDelete();
            }}
          >
            Delete Ad
          </button>
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};
