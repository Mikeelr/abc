"use client";

import { useEffect, useState } from "react";

import styles from "./styles.module.scss";

import Link from "next/link";
import { useUserContext } from "@/app/components/js/Wrapper";
import {
  InvestmentPlanResponseType,
  InvestmentResponseType,
  WalletResponseType,
} from "@/app/components/js/dataTypes";
import { investmentsUrl, plansUrl } from "@/app/components/js/config";
import {
  getRequest,
  postRequest,
  putRequest,
} from "@/app/components/js/api_client";
import Paginate from "@/app/components/js/paginate/Paginate";
import showError from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";
import Image from "next/image";

export const AllInvestments: React.FC<{
  investments: InvestmentResponseType[];
  pages: number;
}> = ({ investments: data, pages }) => {
  const { user } = useUserContext();

  const [investments, setInvestments] =
    useState<InvestmentResponseType[]>(data);

  const fetchData = async (page: number = 1) => {
    const { data } = await getRequest(
      `${investmentsUrl}?page=${page}`,

      user?.token
    );

    setInvestments((e) => data?.data || e);
  };

  return (
    <div className={styles.main}>
      <h1>Investments</h1>
      <div className={styles.table}>
        {investments.length < 1 && <h1>No investment found!</h1>}
        <div className={styles.row}>
          <span>Active Date</span>
          <span>Plan</span>
          {user?.role == 2 && <span>Username</span>}
          <span>Amount</span>
          <span>Activity</span>
          <span>Action</span>
        </div>

        {investments.map((investment) => {
          const date = new Date(investment.activeDate);

          return (
            <div className={styles.row} key={investment._id}>
              <span>{date.toDateString()}</span>
              <span>{investment.planName}</span>
              {user?.role == 2 && (
                <span>{investment.username.toUpperCase()}</span>
              )}
              <span>
                {investment.amount.toLocaleString("USA")}{" "}
                {investment.coinName.toUpperCase()}
              </span>
              <span>{investment.active ? "Active" : "Inactive"}</span>

              <Link
                href={`/dashboard/investments/${investment._id}`}
                className={"action2"}
              >
                Details
              </Link>
            </div>
          );
        })}
      </div>

      <Paginate pages={pages} action={fetchData} />
    </div>
  );
};
export const Invest: React.FC<{
  plan: InvestmentPlanResponseType;
  wallet: WalletResponseType;
}> = ({ plan, wallet }) => {
  const { user } = useUserContext();
  const [amount, setAmount] = useState<number>(1);
  const [error, setError] = useState<string>("");

  const handleCreate = async () => {
    setError("Please wait...");
    const { success, message } = await postRequest(
      investmentsUrl,
      { amount, planId: plan._id },

      user?.token
    );

    success && location.replace("/dashboard/investments/history");
    showError(setError, message);
  };

  return (
    <div className={styles.main}>
      <h1>Invest</h1>
      <div className={styles.box}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <h3>
            Invest In {plan.name} and earn {plan.interest}% interest after{" "}
            {plan.duration} days.
          </h3>
          <label htmlFor="Amount">Amount to invest</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(() => parseInt(e.target.value))}
          />

          <span style={{ color: "var(--t)" }}>
            {amount > (wallet?.balance || 0)
              ? `You do not have enough ${wallet.coinName.toUpperCase()} to continue. Your ${wallet.coinName.toUpperCase()} balance is ${wallet.balance.toLocaleString(
                  "en-US"
                )} ${wallet.coinName.toUpperCase()}.`
              : `You will be getting ${(
                  amount +
                  plan.interest * amount
                ).toLocaleString(
                  "USA"
                )} ${wallet.coinName.toUpperCase()} as total  ROI after ${
                  plan.duration
                } day(s).`}
          </span>

          <button
            disabled={
              amount > (wallet?.balance || 0) ||
              amount < plan.minimum ||
              amount > plan.maximum
            }
          >
            Invest Now
          </button>
          <div className={styles.fRow}>
            <label htmlFor="">Minimum Amount</label>
            <span>
              {plan.minimum} {plan.coinName.toUpperCase()}
            </span>
          </div>
          <div className={styles.fRow}>
            <label htmlFor="">Maximum Amount</label>
            <span>
              {plan.maximum} {plan.coinName.toUpperCase()}
            </span>
          </div>
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};
export const ViewInvestment: React.FC<{
  investment: InvestmentResponseType;
  plan: InvestmentPlanResponseType;
}> = ({ investment, plan }) => {
  const { user } = useUserContext();

  const date = new Date(investment.activeDate);

  const expire = new Date(investment.activeDate + plan.duration * 86400000);

  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const activeDate = date.toDateString();
  const expireDate = expire.toDateString();

  const handleWithdrawal = async () => {
    setError("Please wait...");
    const { success, message } = await putRequest(
      `${investmentsUrl}${investment?._id}`,
      { amount },

      user?.token
    );

    success && location.replace("/dashboard/transactions");
    showError(setError, message);
  };
  const handleActivity = async (active: boolean) => {
    setError("Please wait...");
    const { success, message } = await putRequest(
      `${investmentsUrl}${investment?._id}`,
      { active },

      user?.token
    );

    success && location.replace("/dashboard/investment");
    showError(setError, message);
  };

  return (
    <div className={styles.main}>
      <h1>Manage Investment</h1>
      <div className={styles.box}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleWithdrawal();
          }}
        >
          <div className={styles.iRow}>
            <label htmlFor="">Investor Name</label>
            <span>{investment.username.toUpperCase()}</span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Amount</label>
            <span>
              {investment.amount.toLocaleString("en-US")}{" "}
              {plan.coinName.toUpperCase()}
            </span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Investment Date</label>
            <span>{investment.createdAt.split("T")[0]}</span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Activation Date</label>
            <span>{activeDate}</span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Ends On</label>
            <span>{expireDate}</span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Investment Status</label>
            <span>{investment.active ? "Active" : "Inactive"}</span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Interest Withdrawn</label>
            <span>
              {investment.interestWithdrawn.toLocaleString("en-US")}{" "}
              {plan.coinName.toUpperCase()}
            </span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Interest Available</label>
            <span>
              {investment.interestAvailable.toLocaleString("en-US")}{" "}
              {plan.coinName.toUpperCase()}
            </span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Total ROI</label>
            <span>
              {(investment.interestPaid + investment.amount).toLocaleString(
                "en-US"
              )}{" "}
              {plan.coinName.toUpperCase()}
            </span>
          </div>
          {investment.capitalPaid && (
            <div className={styles.iRow}>
              <label htmlFor="">Total ROI Paid</label>
              <span>
                {(investment.interestPaid + investment.amount).toLocaleString(
                  "en-US"
                )}{" "}
                {plan.coinName.toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h1>_________________</h1>
          </div>
          {user?.role != 2 && (
            <div className={styles.column}>
              <h1>Withdraw Interest</h1>
              <label htmlFor="Amount">Amount to Withdraw</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(() => parseInt(e.target.value))}
              />
              {amount > investment.interestAvailable && (
                <span style={{ color: "var(--s)" }}>
                  Amount exceeds available interest
                </span>
              )}
            </div>
          )}

          {user?.role != 2 ? (
            <button disabled={amount > investment.interestAvailable}>
              Withdraw Interest
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleActivity(!investment.active);
              }}
              disabled={investment.capitalPaid}
            >
              {investment.active ? "Deactivate" : "Activate"}
            </button>
          )}
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};
export const PlanList: React.FC<{
  pages: number;
  plans: InvestmentPlanResponseType[];
}> = ({ pages, plans: data }) => {
  const { user } = useUserContext();

  const [plans, setPlans] = useState<InvestmentPlanResponseType[]>(data);

  const fetchData = async (page: number = 1) => {
    const { data } = await getRequest(
      `${plansUrl}?page=${page}`,

      user?.token
    );
    setPlans((e) => data?.data || e);
  };

  useEffect(() => {
    if (user?.token) {
      fetchData();
    }
  }, [user?.token]);

  return (
    <div className={styles.main}>
      <h1>Invest Now</h1>
      <div
        className={styles.container}
        style={{ flexDirection: "row", gap: "10px" }}
      >
        <Link href={"/dashboard/investments/history"} className="action2">
          Investment History
        </Link>
        {user?.role == 2 && (
          <Link href={"/dashboard/investments/plans"} className="action2">
            Manage Packages
          </Link>
        )}
      </div>
      <div className={styles.grid}>
        {plans.length < 1 && (
          <h1>No investment package available at the moment</h1>
        )}

        {plans.map((plan) => (
          <div className={styles.plan} key={plan._id}>
            <div className={styles.banner}>
              <Image src={plan.img} fill alt="" />
            </div>
            <div className={styles.under}>
              <h2>{plan.name}</h2>
              <div>
                <span>Minimum</span>
                <p>
                  {plan.minimum.toLocaleString("USA")}{" "}
                  {plan.coinName.toUpperCase()}
                </p>
              </div>
              <div>
                <span>Maximum</span>
                <p>
                  {plan.maximum.toLocaleString("USA")}{" "}
                  {plan.coinName.toUpperCase()}
                </p>
              </div>
              <div>
                <span>Duration</span>
                <p>{plan.duration} Days</p>
              </div>
              <div>
                <span>Interest</span>
                <p>{plan.interest * 100}%</p>
              </div>
              <div>
                <span>Interest Payment</span>
                <p>Every {plan.interestPayment} Day(s)</p>
              </div>
              <Link
                className={"action2"}
                href={`/dashboard/investments/invest?id=${plan._id}`}
              >
                Invest Now
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Paginate pages={pages} action={fetchData} />
    </div>
  );
};

export default AllInvestments;
