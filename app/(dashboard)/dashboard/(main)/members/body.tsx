"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import {
  UserResponseType,
  WalletResponseType,
} from "@/app/components/js/dataTypes";
import { getRequest, putRequest } from "@/app/components/js/api_client";
import { usersUrl, walletsUrl } from "@/app/components/js/config";
import { useUserContext } from "@/app/components/js/Wrapper";
import showError from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";

export const Members: React.FC<{ users: UserResponseType[] }> = ({
  users: userz,
}) => {
  const { user } = useUserContext();
  const [users, setUsers] = useState<UserResponseType[]>(userz);
  const fetchData = async (email = "@") => {
    const { data } = await getRequest(
      `${usersUrl}?email=${email}`,
      user?.token
    );

    if (data) setUsers(data.data);
  };

  return (
    <div className={styles.members}>
      <h1>Members</h1>
      <div className={styles.search}>
        <form>
          <input
            type="text"
            placeholder="enter email..."
            onChange={(e) => fetchData(e.target.value)}
          />
        </form>
      </div>
      <div className={styles.table}>
        <div className={styles.row}>
          <span>Name</span>
          <span>Username</span>
          <span>Company Name</span>
          <span>Role</span>
          <span>View</span>
        </div>
        {users.map((uzer) => {
          return (
            <div key={uzer._id} className={styles.row}>
              <span>{uzer.sName + " " + uzer.oNames}</span>
              <span>{uzer.username.toUpperCase()}</span>
              <span>{uzer.companyName}</span>
              {uzer.role == 0 && <span>Member</span>}
              {uzer.role == 1 && <span>Partner Admin</span>}
              {uzer.role == 2 && <span>Super admin</span>}
              <Link
                className={"action2"}
                href={`/dashboard/members/${uzer._id}`}
              >
                Edit
              </Link>
            </div>
          );
        })}
        {users.length == 0 && <h1>Fetching...</h1>}
      </div>
    </div>
  );
};
export const UpdateMember: React.FC<{
  foundUser: UserResponseType;
  wallets: WalletResponseType[];
}> = ({ foundUser, wallets }) => {
  const { user } = useUserContext();

  const [companyName, setCompanyName] = useState<string>("");

  const [role, setRole] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [p2pEligible, setP2pEligible] = useState<boolean>(true);
  const [selWallet, setSelWallet] = useState<WalletResponseType>(wallets[0]);
  const [amount, setAmount] = useState<string>("0");
  const [error, setError] = useState<string>("");

  const updateUser = async () => {
    setError("Please wait ...");
    if (role == 2) {
      showError(setError, "Please contact your developer");
      return;
    }
    const { success, message } = await putRequest(
      `${usersUrl}${foundUser?._id}`,
      {
        role,
        disabled,
        companyName,
        p2pEligible,
      },
      user?.token
    );

    if (success) location.reload();
    showError(setError, message);
  };
  const handleFunding = async (add = true) => {
    setError("Please wait ...");

    const { message, success } = await putRequest(
      `${walletsUrl}${selWallet?._id}`,
      {
        amount: (add ? 1 : -1) * parseFloat(amount),
      },
      user?.token
    );

    showError(setError, message);
    if (success) location.reload();
  };

  useEffect(() => {
    if (foundUser) {
      setDisabled(() => foundUser.disabled);
      setP2pEligible(() => foundUser.p2pEligible);
      setRole(() => foundUser.role);
      setCompanyName(() => foundUser.companyName);
    }
  }, [foundUser?._id]);

  return (
    <div className={styles.members}>
      <h1>UPDATE {foundUser.username.toUpperCase()}</h1>
      <div className={styles.container}>
        <form id="form">
          <label htmlFor="email">Email</label>
          <input type="text" value={foundUser.email} disabled />
          <label htmlFor="Username">Username</label>
          <input type="text" value={foundUser.username} disabled />
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            value={foundUser.sName + " " + foundUser.oNames}
            disabled
          />
          <label htmlFor="kyc">KYC status</label>
          <input
            type="text"
            value={foundUser.verified ? "Completed" : "Pending"}
            disabled
          />
          <label htmlFor="tel">Phone No</label>
          <input type="text" value={foundUser.tel} disabled />

          <label htmlFor="status">User Status</label>
          <select
            value={disabled ? "true" : "false"}
            onChange={(e) => setDisabled(() => e.target.value == "true")}
          >
            <option value="true">Banned</option>
            <option value="false">Approved User</option>
          </select>
          <label htmlFor="company">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(() => e.target.value)}
          />
          <label htmlFor="p2p">P2P Eligible</label>
          <select
            value={p2pEligible ? "true" : "false"}
            onChange={(e) => setP2pEligible(() => e.target.value == "true")}
          >
            <option value="true">Sell and Buy</option>
            <option value="false">Buyer only</option>
          </select>
          <button
            onClick={(e) => {
              e.preventDefault();
              updateUser();
            }}
          >
            Update User
          </button>
        </form>

        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Funding</h2>
          <label htmlFor="Amount">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(() => e.target.value)}
          />
          <label htmlFor="wallet">Choose Wallet</label>
          <select
            value={selWallet?._id || ""}
            onChange={(e) =>
              setSelWallet(
                () => wallets.find((wallet) => wallet._id == e.target.value)!
              )
            }
          >
            {wallets.map((wallet) => (
              <option value={wallet._id} key={wallet._id}>
                {wallet.coinName.toUpperCase()} ({wallet.balance})
              </option>
            ))}
          </select>
          <h1>
            Available balance {selWallet?.balance}{" "}
            {selWallet?.coinName.toUpperCase()}
          </h1>
          <div style={{ width: "100%", gap: "20px" }}>
            <button onClick={() => handleFunding(true)} style={{ flex: "1" }}>
              Fund
            </button>
            <button onClick={() => handleFunding(false)} style={{ flex: "1" }}>
              Deduct
            </button>
          </div>
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};

export default Members;
