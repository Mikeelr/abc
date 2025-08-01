"use client";

import { useEffect, useState } from "react";

import styles from "./styles.module.scss";
import Link from "next/link";
import { useUserContext } from "@/app/components/js/Wrapper";
import {
  BankInfoResponseType,
  P2PMarketResponseType,
  P2PTransactionResponseType,
  P2PWalletType,
} from "@/app/components/js/dataTypes";
import {
  getRequest,
  postRequest,
  putRequest,
} from "@/app/components/js/api_client";
import {
  banksUrl,
  p2pMarketsUrl,
  p2pTransactionsUrl,
  p2pWalletsUrl,
} from "@/app/components/js/config";
import Paginate from "@/app/components/js/paginate/Paginate";
import { uploadFile } from "@/app/components/js/firebaseconfig";
import showError from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";
import { useSearchParams } from "next/navigation";

export const AllOrders: React.FC = () => {
  const { user } = useUserContext();

  const [pages, setPages] = useState<number>(1);
  const [status, setStatus] = useState<string>("0");
  const [orders, setOrders] = useState<P2PTransactionResponseType[]>([]);

  const fetchOrders = async (page: number = 1) => {
    const { data } = await getRequest(
      `${p2pTransactionsUrl}?page=${page}&status=${status}`,

      user?.token
    );

    if (data) {
      setOrders(() => data.data);
      setPages(data.pages);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchOrders();
    }
  }, [user?.token, status]);

  return (
    <div className={styles.orders}>
      <h1>Order History</h1>

      <select
        className="action2"
        value={status}
        onChange={(e) => setStatus(() => e.target.value)}
      >
        <option value={"0"}>Pending</option>
        <option value={"1"}>Completed</option>
        <option value={"-1"}>Cancelled</option>
        <option value={""}>All</option>
      </select>

      <div className={styles.grid}>
        {orders.length == 0 && <h1>No orders found</h1>}
        {orders.map((order) => {
          return (
            <div
              className={styles.order}
              key={order._id}
              style={{ padding: "2.5%" }}
            >
              <h1>
                {order.baseCoin.toUpperCase() +
                  "<=>" +
                  order.newCoin.toUpperCase()}
              </h1>

              <div>
                <span>Amount</span>
                <p>
                  {order.amount.toLocaleString("USA")}{" "}
                  {order.baseCoin.toUpperCase()}
                </p>
              </div>
              <div>
                <span>Total Payable</span>
                <p>
                  {(order.amount * order.rate).toLocaleString("USA")}{" "}
                  {order.newCoin.toUpperCase()}
                </p>
              </div>
              <div>
                <span>Order Status</span>
                {order.status == 0 && <span>Pending</span>}
                {order.status == 1 && <span>Paid</span>}
                {order.status == -1 && <span>Cancelled</span>}
              </div>
              {order.status == 0 && (
                <div id={order._id}>
                  <Link
                    href={`/dashboard/p2p/orders/${order._id}`}
                    className={"action2"}
                  >
                    Update
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Paginate pages={pages} action={fetchOrders} />
    </div>
  );
};
export const UpdateOrder: React.FC<{ order: P2PTransactionResponseType }> = ({
  order,
}) => {
  const { user } = useUserContext();

  const [mins, setMins] = useState<number>(30);
  const [secs, setSecs] = useState<number>(60);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const date = new Date();
    const now = date.getTime();
    const createDate = new Date(order.createdAt);
    const create = createDate.getTime();

    const diff = (now - create) / 60000;
    const seconds = diff - Math.floor(diff);

    setSecs(() => (diff < 30 ? Math.floor(seconds * 60) : 0));
    setMins(() => (diff < 30 ? 30 - Math.floor(diff) : 0));
    if (diff >= 30 && !order.paid && order.status == 0)
      updateOrderTimeOut(order._id);
  }, [order._id]);
  const updatePayStatus = async (id: string, paid: boolean, cancel = false) => {
    if (order?.buyerUsername != user?.username) return;

    setError("Please wait...");

    if (cancel) {
      const { message } = await putRequest(
        `${p2pTransactionsUrl}${id}`,
        { status: -1 },

        user.token
      );
      showError(setError, message);
    } else {
      const images = await uploadFile(id, id);

      const { message } = await putRequest(
        `${p2pTransactionsUrl}${id}`,
        { img: images[0], paid },

        user.token
      );
      showError(setError, message);
    }

    location.reload();
  };
  const updateOrderStatus = async (id: string, status: number) => {
    if (order?.sellerUsername != user?.username && user?.role != 2) return;

    setError("Please wait...");

    const { success, message } = await putRequest(
      `${p2pTransactionsUrl}${id}`,
      { status },

      user.token
    );
    success && location.replace("/dashboard/p2p/orders");
    showError(setError, message);
  };
  const updateOrderTimeOut = async (id: string) => {
    await putRequest(
      `${p2pTransactionsUrl}${id}`,
      { timeOut: true },

      user?.token
    );
    location.reload();
  };

  useEffect(() => {
    if (mins <= 0 && secs <= 2 && order) {
      if (!order?.paid && order?.status == 0) updateOrderTimeOut(order._id);
    }
  }, [mins, secs, order]);
  useEffect(() => {
    if (order?.status == 0 && !order.paid) {
      if (mins != 0 || secs != 0) {
        const timer = setInterval(() => {
          setSecs((e) => {
            let sec = 0;
            if (e - 1 < 0 && mins > 0) {
              sec = 59;
            } else if (e - 1 >= 0) {
              sec = e - 1;
            }
            return sec;
          });
          setMins((e) => {
            let min = e;
            if (secs - 1 < 0 && e - 1 > 0) {
              min -= 1;
            }
            return min;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  }, [mins, secs, order?.status, order?.paid]);

  return (
    <div className={styles.orders}>
      {order?.status == 0 && !order.paid && (
        <h1>
          Time Left: {mins} mins {secs}s
        </h1>
      )}

      <div className={styles.box}>
        <div className={styles.order} id={`${order._id}`}>
          <h3>
            {order.baseCoin.toUpperCase() + "<=>" + order.newCoin.toUpperCase()}
          </h3>

          <div>
            <span>Date</span>
            <p>
              {order.createdAt.split("T")[0]}{" "}
              {order.createdAt.split("T")[1]?.slice(0, 8)}
            </p>
          </div>
          <div>
            <span>Amount</span>
            <p>
              {order.amount.toLocaleString("USA")}
              {order.baseCoin.toUpperCase()}
            </p>
          </div>
          <div>
            <span>Buyer</span>
            <p>{order.buyerUsername.toUpperCase()}</p>
          </div>
          <div>
            <span>Seller</span>
            <p>{order.sellerUsername.toUpperCase()}</p>
          </div>
          <div>
            <span>Order Status</span>
            {order.status == 0 && <span>Pending</span>}
            {order.status == 1 && <span>Paid</span>}
            {order.status == -1 && <span>Cancelled</span>}
          </div>
          <div>
            <span>Total Paid</span>
            <p>
              {(order.amount * order.rate).toLocaleString("USA")}
              {order.newCoin.toUpperCase()}
            </p>
          </div>
          {order.buyerUsername == user?.username &&
            order.status == 0 &&
            !order.paid && (
              <div id={order._id}>
                <span>Upload Payment Image</span>
              </div>
            )}
          {order.buyerUsername == user?.username &&
            order.status == 0 &&
            !order.paid && (
              <div id={order._id}>
                <input
                  type="file"
                  accept="image/*"
                  aria-describedby={order.img}
                />
              </div>
            )}

          {order.buyerUsername == user?.username &&
            order.status == 0 &&
            !order.paid && (
              <div id={order._id}>
                <button
                  className={styles.action}
                  onClick={() => {
                    updatePayStatus(order._id, true);
                  }}
                >
                  Mark as paid
                </button>
              </div>
            )}
          {order.buyerUsername == user?.username && order.status == 0 && (
            <div id={order._id}>
              <button
                className={styles.action}
                onClick={() => {
                  updatePayStatus(order._id, false, true);
                }}
              >
                Cancel Order
              </button>
            </div>
          )}
          {(order.sellerUsername == user?.username || user?.role == 2) &&
            order.paid &&
            order.status == 0 && (
              <div id={order._id}>
                <button
                  className={styles.action}
                  onClick={() => {
                    updateOrderStatus(order._id, 1);
                  }}
                >
                  Release Order
                </button>
              </div>
            )}
          {user?.role == 2 && order.status == 0 && (
            <div id={order._id}>
              <button
                className={styles.action}
                onClick={() => {
                  updateOrderTimeOut(order._id);
                }}
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <Spinner error={error} />}
    </div>
  );
};

export const CreateOrder: React.FC = () => {
  const { user } = useUserContext();

  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [bankName, setBankName] = useState<string>("");
  const [accName, setAccName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [accNo, setAccNo] = useState<string>("");
  const [market, setMarket] = useState<P2PMarketResponseType>();
  const [wallets, setWallets] = useState<P2PWalletType[]>([]);
  const [bankDetails, setBankDetails] = useState<BankInfoResponseType[]>([]);
  const [bankDetail, setBankDetail] = useState<BankInfoResponseType>();
  const searchParams = useSearchParams();
  const marketId = searchParams.get("id");
  const fetchData = async () => {
    const { data } = await getRequest(
      `${p2pMarketsUrl}${marketId}`,
      user?.token
    );

    if (data?.type == 1) {
      const { data: wall } = await getRequest(
        `${p2pWalletsUrl}?onlyWallets=true`,
        user?.token
      );
      setWallets(() => wall.data);
    }
    setMarket(() => data);
  };
  const getBankInfo = async () => {
    const { data: bank } = await getRequest(
      `${banksUrl}?username=${market?.username}`,
      user?.token
    );

    setBankDetails(() => bank?.data || []);
  };
  const handleCreate = async () => {
    setError("Please wait...");
    const { success, message } = await postRequest(
      p2pTransactionsUrl,
      {
        P2PId: market?._id,
        amount,
        paymentDetails:
          market?.type == 0 ? bankDetail : { bankName, accName, accNo },
      },

      user?.token
    );
    showError(setError, message);
    success && location.replace("/dashboard/p2p/orders");
  };
  useEffect(() => {
    if (user?.token) {
      fetchData();
    }
  }, [user?.token]);
  useEffect(() => {
    if (market?.type == 1) {
      const selWallet = wallets.find(
        (wallet) => wallet.coinName == market?.baseCoin
      );
      if (!selWallet) setBalance(() => 0);
      else setBalance(() => selWallet.balance);
    }
  }, [amount]);

  return (
    <div className={styles.orders}>
      <h1>Order Page</h1>
      {market?.type == 1 && (balance == 0 || balance < amount) && (
        <h3>Insufficient funds</h3>
      )}
      {market && (
        <div className={styles.container}>
          <div className={styles.order}>
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
            <div>
              <span>Phone No</span>
              <p>{market.tel}</p>
            </div>

            <div>
              <p>{market.type == 1 ? "Buy Ads" : "Sell Ads"}</p>
            </div>
          </div>

          {market?.type == 1 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <label htmlFor="">Amount to sell</label>
              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(() => parseFloat(e.target.value) || 0)
                }
              />
              <p>
                Your available balance is
                {balance.toLocaleString("USA")} ${market.baseCoin.toUpperCase()}
              </p>
              {amount <= market.amount ? (
                <p>
                  {market.username.toUpperCase()} will pay you{" "}
                  {market.newCoin.toUpperCase()}{" "}
                  {(market.rate * amount).toLocaleString("USA")}
                </p>
              ) : (
                <p style={{ color: "red" }}>
                  Maximum amount you can sell is{" "}
                  {market.amount.toLocaleString("USA")} $
                  {market.baseCoin.toUpperCase()}
                </p>
              )}
              <label htmlFor="">Your Account Number</label>
              <input
                type="text"
                value={accNo}
                onChange={(e) => setAccNo(() => e.target.value)}
              />
              <label htmlFor="">Name on Account</label>
              <input
                type="text"
                value={accName}
                onChange={(e) => setAccName(() => e.target.value)}
              />
              <label htmlFor="">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(() => e.target.value)}
              />
              <button
                disabled={
                  amount <= 0 ||
                  amount > balance ||
                  amount > market.amount ||
                  !bankName ||
                  !accName ||
                  !accNo
                }
                className={styles.action}
              >
                Sell
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <label htmlFor="">Amount to buy</label>
              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(() => parseFloat(e.target.value) || 0)
                }
              />
              {bankDetails.length > 0 ? (
                <label htmlFor="">Choose seller account to pay to</label>
              ) : (
                <span className={"action2"} onClick={getBankInfo}>
                  Show Payment Details
                </span>
              )}

              {bankDetails.length > 0 && (
                <select
                  value={bankDetail?._id || ""}
                  onChange={(e) =>
                    setBankDetail(() =>
                      bankDetails.find((bank) => bank._id == e.target.value)
                    )
                  }
                >
                  <option value={""}>Select</option>
                  {bankDetails.map((bank) => (
                    <option value={bank._id} key={bank._id}>
                      {bank.bankName +
                        " | " +
                        bank.accName +
                        " | " +
                        bank.accNo}
                    </option>
                  ))}
                </select>
              )}

              {bankDetail && (
                <div className={styles.column}>
                  <p>
                    Pay {market.newCoin.toUpperCase()}{" "}
                    {(market.rate * amount).toLocaleString("USA")} to{" "}
                  </p>
                  <h3
                    onClick={(e) => {
                      const target = e.target as HTMLHeadingElement;
                      const text = target.innerText;
                      navigator.clipboard.writeText(bankDetail.accNo);
                      target.innerText = "Copied";
                      setTimeout(() => (target.innerText = text), 2000);
                    }}
                  >
                    Acc No: {bankDetail.accNo}
                  </h3>
                  <h3
                    onClick={(e) => {
                      const target = e.target as HTMLHeadingElement;
                      const text = target.innerText;
                      navigator.clipboard.writeText(bankDetail.accName);
                      target.innerText = "Copied";
                      setTimeout(() => (target.innerText = text), 2000);
                    }}
                  >
                    Acc Name: {bankDetail.accName.toUpperCase()}
                  </h3>
                  <h3
                    onClick={(e) => {
                      const target = e.target as HTMLHeadingElement;
                      const text = target.innerText;
                      navigator.clipboard.writeText(bankDetail.bankName);
                      target.innerText = "Copied";
                      setTimeout(() => (target.innerText = text), 2000);
                    }}
                  >
                    Bank Name: {bankDetail.bankName.toUpperCase()}
                  </h3>
                </div>
              )}
              <button
                disabled={amount <= 0 || !bankDetail || amount > market.amount}
                className={styles.action}
              >
                Buy
              </button>
            </form>
          )}
        </div>
      )}
      {error && <Spinner error={error} />}
    </div>
  );
};
