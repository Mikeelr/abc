"use client";
import { useEffect, useState } from "react";

import styles from "../styles.module.scss";

import Link from "next/link";
import { useUserContext } from "@/app/components/js/Wrapper";
import {
  InvestmentPlanResponseType,
  WalletResponseType,
} from "@/app/components/js/dataTypes";
import {
  getRequest,
  postRequest,
  putRequest,
} from "@/app/components/js/api_client";
import { plansUrl } from "@/app/components/js/config";
import { uploadFile } from "@/app/components/js/firebaseconfig";
import showError from "@/app/components/js/showError";
import Paginate from "@/app/components/js/paginate/Paginate";
import Spinner from "@/app/components/js/spinner/Spinner";
export const Plans: React.FC<{
  investmentPlans: InvestmentPlanResponseType[];
  pages: number;
  wallets: WalletResponseType[];
}> = ({ investmentPlans: data, pages, wallets }) => {
  const { user } = useUserContext();

  const [investmentPlans, setInvestmentPlans] =
    useState<InvestmentPlanResponseType[]>(data);
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [duration, setDuration] = useState<number>(90);
  const [interest, setInterest] = useState<number>(0.5);
  const [minimum, setMinimum] = useState<number>(10);
  const [maximum, setMaximum] = useState<number>(100);
  const [interestPayment, setInterestPayment] = useState<number>(30);
  const [coinName, setCoinName] = useState<string>("");
  const fetchData = async (page: number) => {
    const { data } = await getRequest(
      `${plansUrl}?all=true&page=${page}`,
      user?.token
    );
    setInvestmentPlans(data?.data || []);
  };
  const handleCreate = async () => {
    setError("Please wait ...");
    const images = await uploadFile(name, "form");
    const { data, message, success } = await postRequest(
      plansUrl,
      {
        name,
        duration,
        interest,
        minimum,
        interestPayment,
        maximum,
        coinName,
        img: images[0],
        show: true,
      },
      user?.token
    );
    success && setInvestmentPlans((e) => [data, ...e]);
    showError(setError, message);
  };

  return (
    <div className={styles.main}>
      <h1>Investment Plans</h1>
      <div className={styles.container}>
        <form id="form">
          <h2>Create Investment Package</h2>
          <label htmlFor="Name">Investment Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(() => e.target.value)}
          />
          <label>Cryptocurrency</label>
          <select
            onChange={(e) => setCoinName(e.target.value)}
            value={coinName}
          >
            <option value={""}>Choose</option>
            {wallets.map((e) => (
              <option value={e.coinName} key={e._id}>
                {e.coinName.toUpperCase()}
              </option>
            ))}
          </select>
          <label htmlFor="duration">Duration In Days</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(() => parseInt(e.target.value))}
          />
          <label htmlFor="Interest">Interest</label>
          <input
            type="number"
            value={interest}
            onChange={(e) => setInterest(() => parseFloat(e.target.value))}
          />
          <span style={{ color: "var(--t)" }}>
            That will be {interest * 100}% interest.
          </span>
          <label htmlFor="Minimum">Minimum Amount To Invest</label>
          <input
            type="number"
            value={minimum}
            onChange={(e) => setMinimum(() => parseInt(e.target.value))}
          />
          <label htmlFor="Maximum">Maximum Amount To Invest</label>
          <input
            type="number"
            value={maximum}
            onChange={(e) => setMaximum(() => parseInt(e.target.value))}
          />
          <label htmlFor="intPayment">Interest Withdrawal</label>
          <input
            type="number"
            value={interestPayment}
            onChange={(e) => setInterestPayment(() => parseInt(e.target.value))}
          />

          <label htmlFor="Img">Showcase Image</label>
          <input type="file" accept="image/*" />

          <button
            onClick={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            Create
          </button>
        </form>

        <div className={styles.table}>
          <h1>Investment Packages</h1>

          <div className={styles.row}>
            <span>Plan Name</span>
            <span>Activity</span>
            <span>Minimum Deposit</span>
            <span>Maximum Deposit</span>
            <span>Action</span>
          </div>
          {investmentPlans.map((plan) => (
            <div key={plan._id} className={styles.row}>
              <span>{plan.name}</span>
              <span>{plan.show ? "Active" : "Inactive"}</span>
              <span>
                {plan.minimum} {plan.coinName.toUpperCase()}
              </span>
              <span>
                {plan.maximum} {plan.coinName.toUpperCase()}
              </span>
              <Link
                className={"action2"}
                href={`/dashboard/investments/plans/${plan._id}`}
              >
                View
              </Link>
            </div>
          ))}
          {investmentPlans.length == 0 && <h1>No Investment Plans</h1>}
          <Paginate pages={pages} action={fetchData} />
        </div>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};
export const UpdatePlan: React.FC<{
  plan: InvestmentPlanResponseType;
  wallets: WalletResponseType[];
}> = ({ plan: selInvestmentPlan, wallets }) => {
  const { user } = useUserContext();

  const [error, setError] = useState<string>("");

  const [coinName, setCoinName] = useState<string>("");
  const [duration, setDuration] = useState<number>(90);
  const [interest, setInterest] = useState<number>(0.5);
  const [minimum, setMinimum] = useState<number>(10);
  const [maximum, setMaximum] = useState<number>(100);
  const [interestPayment, setInterestPayment] = useState<number>(30);
  const [show, setShow] = useState<boolean>(true);

  const handleUpdate = async (id: string = selInvestmentPlan!._id) => {
    setError("Please wait ...");

    const images = await uploadFile(selInvestmentPlan.name, "form");
    const { success, message } = await putRequest(
      `${plansUrl}${id}`,
      {
        duration,
        interest,

        minimum,
        interestPayment,
        maximum,
        img: images[0],
        show,
      },
      user?.token
    );
    success && location.replace("/dashboard/investments/plans");
    showError(setError, message);
  };

  useEffect(() => {
    if (selInvestmentPlan) {
      setDuration(() => selInvestmentPlan.duration);
      setInterest(() => selInvestmentPlan.interest);
      setMinimum(() => selInvestmentPlan.minimum);
      setInterestPayment(() => selInvestmentPlan.interestPayment);
      setMaximum(() => selInvestmentPlan.maximum);
      setShow(() => selInvestmentPlan.show);
      setCoinName(() => selInvestmentPlan.coinName);
    }
  }, [selInvestmentPlan._id]);

  return (
    <div className={styles.main}>
      <h1>Update {selInvestmentPlan.name}</h1>
      <div className={styles.box}>
        <form id="form">
          <label>Cryptocurrency</label>
          <select
            onChange={(e) => setCoinName(e.target.value)}
            value={coinName}
          >
            <option value={""}>Choose</option>
            {wallets.map((e) => (
              <option value={e.coinName} key={e._id}>
                {e.coinName.toUpperCase()}
              </option>
            ))}
          </select>
          <label htmlFor="duration">Duration In Days</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(() => parseInt(e.target.value))}
          />
          <label htmlFor="Interest">Interest</label>
          <input
            type="number"
            value={interest}
            onChange={(e) => setInterest(() => parseFloat(e.target.value))}
          />
          <span style={{ color: "var(--t)" }}>
            That will be {interest * 100}% interest.
          </span>
          <label htmlFor="Minimum">Minimum Amount To Invest</label>
          <input
            type="number"
            value={minimum}
            onChange={(e) => setMinimum(() => parseInt(e.target.value))}
          />
          <label htmlFor="Maximum">Maximum Amount To Invest</label>
          <input
            type="number"
            value={maximum}
            onChange={(e) => setMaximum(() => parseInt(e.target.value))}
          />
          <label htmlFor="intPayment">Interest Withdrawal</label>
          <input
            type="number"
            value={interestPayment}
            onChange={(e) => setInterestPayment(() => parseInt(e.target.value))}
          />
          <label htmlFor="show">Allow Investments</label>
          <select
            value={show ? "true" : "false"}
            onChange={(e) => setShow(() => e.target.value == "true")}
          >
            <option value="true">Investments allowed</option>
            <option value="false">Plan not active</option>
          </select>
          <label htmlFor="Img">Showcase Image</label>
          <input
            type="file"
            accept="image/*"
            aria-describedby={selInvestmentPlan.img}
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            Update Investment Plan
          </button>
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};

export default Plans;
