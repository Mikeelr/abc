"use client";

import { useSearchParams } from "next/navigation";

import { MdOutlinePending } from "react-icons/md";
import { FcApproval, FcCancel } from "react-icons/fc";
import { TransactionResponseType } from "@/app/components/js/dataTypes";
import { getRequest, putRequest } from "@/app/components/js/api_client";
import { useUserContext } from "@/app/components/js/Wrapper";
import { transactionsUrl } from "@/app/components/js/config";
import Paginate from "@/app/components/js/paginate/Paginate";
import { useState } from "react";
import styles from "./styles.module.scss";
import Spinner from "@/app/components/js/spinner/Spinner";
import showError from "@/app/components/js/showError";
export const Body: React.FC<{
  transactionz: TransactionResponseType[];
  pages: number;
}> = ({ transactionz, pages }) => {
  const { user } = useUserContext();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const coinName = searchParams.get("coinName");
  const [transactions, setTransactions] =
    useState<TransactionResponseType[]>(transactionz);

  const fetchData = async (page: number) => {
    const { data, success } = await getRequest(
      `${transactionsUrl}?page=${page}${
        coinName ? `&coinName=${coinName}` : ""
      }`,
      user?.token
    );
    if (success) setTransactions(data.data);
  };
  const handleStatus = async (id: string, status: number) => {
    if (user?.role != 2) return;
    setError("Please wait...");
    const { success, message } = await putRequest(
      `${transactionsUrl}${id}`,
      { status },
      user.token
    );
    showError(setError, message);
    if (success) {
      location.reload();
    }
  };

  return (
    <div className={styles.transactions}>
      <h1>Transactions</h1>
      <div className={styles.table}>
        {transactions.map((tran) => (
          <div key={tran._id} className={styles.transaction}>
            <div className={styles.icon}>
              {tran.status == 1 && (
                <span style={{ color: "green" }}>
                  <FcApproval />
                </span>
              )}
              {tran.status == 0 && (
                <span style={{ color: "var(--p)" }}>
                  <MdOutlinePending />
                </span>
              )}
              {tran.status == -1 && (
                <span style={{ color: "var(--s)" }}>
                  <FcCancel />
                </span>
              )}
            </div>
            <div className={styles.desc}>
              <p>
                Transferred {tran.amount} {tran.coinName.toUpperCase()} from{" "}
                {tran.senderWalletAddress} to {tran.receiverWalletAddress} via{" "}
                {tran._id} on {tran.network} network.
              </p>
              <p>
                {user?.role == 2 && (
                  <span>{tran.username.toUpperCase()} &nbsp;</span>
                )}

                <span>{tran.createdAt.split("T")[0]}</span>
              </p>
            </div>
            <div className={styles.info}>
              <p className={styles.amount}>
                {tran.type == 0 && tran.status == 1 && "-"}
                {tran.amount.toLocaleString("USA")}{" "}
                {tran.coinName.toUpperCase()}
              </p>
              <span>
                {tran.channel == 0 ? "Manual" : "Gateway"}{" "}
                {tran.type == 1 ? "Deposit" : "Transfer"}
              </span>
            </div>

            {user?.role == 2 && (
              <div className={styles.actions}>
                <button
                  onClick={() => handleStatus(tran._id, 1)}
                  disabled={
                    tran.status == 1 ||
                    tran.internalTran ||
                    (tran.type == 0 && tran.channel == 1)
                  }
                  className={styles.action}
                >
                  Approve
                </button>
                <button
                  className={styles.action}
                  onClick={() => handleStatus(tran._id, -1)}
                  disabled={
                    tran.status == -1 ||
                    tran.internalTran ||
                    (tran.type == 0 && tran.channel == 1)
                  }
                >
                  Disapprove
                </button>
              </div>
            )}
          </div>
        ))}
        {transactions.length == 0 && <h1>No Transaction at the moment.</h1>}
      </div>

      <Paginate pages={pages} action={fetchData} />
      {error && <Spinner error={error} />}
    </div>
  );
};

export default Body;
