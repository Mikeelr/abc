"use client";
import { useEffect, useState } from "react";

import styles from "./styles.module.scss";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/app/components/js/api_client";
import {
  apikeysUrl,
  banksUrl,
  cryptosUrl,
  usersUrl,
  walletsUrl,
} from "@/app/components/js/config";
import { useUserContext } from "@/app/components/js/Wrapper";
import showError from "@/app/components/js/showError";
import {
  APIKeyResponseType,
  BankInfoResponseType,
  CryptoResponseType,
  WalletResponseType,
} from "@/app/components/js/dataTypes";
import Paginate from "@/app/components/js/paginate/Paginate";

export const BasicData: React.FC<{ setError: (e: string) => void }> = ({
  setError,
}) => {
  const { user, logout } = useUserContext();

  const [password, setPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [tel, setTel] = useState<string>(user?.tel || "");

  const handlePassword = async () => {
    setError("Please wait ...");
    const { success, message } = await putRequest(
      `${usersUrl}${user?._id}`,
      {
        password,
        oldPassword,
      },
      user?.token
    );

    showError(setError, message);
    if (success) location.reload();
  };
  const handleUser = async () => {
    setError("Please wait ...");
    const { message, success } = await putRequest(
      `${usersUrl}${user?._id}`,
      {
        tel,
      },
      user?.token
    );
    showError(setError, message);
    if (success) location.reload();
  };

  return (
    <div className={styles.data}>
      <form id="form" onSubmit={(e) => e.preventDefault()}>
        <h1>
          WELCOME {user?.sName} {user?.oNames}
        </h1>
        <label htmlFor="">Email</label>
        <input type="text" value={user?.email || ""} disabled />
        <label htmlFor="">Username</label>
        <input
          type="text"
          value={user?.username.toUpperCase() || ""}
          disabled
        />
        <label htmlFor="">KYC Status</label>
        <input
          type="text"
          value={user?.verified ? "Completed" : "Pending"}
          disabled
        />
        <span className={styles.vSpacer}></span>
        <button onClick={() => logout()}>Log Out</button>
        <span className={styles.vSpacer}></span>
        <label>Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(() => e.target.value)}
        />
        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(() => e.target.value)}
        />
        <button onClick={() => handlePassword()}>Change Password</button>
        <span className={styles.vSpacer}></span>
        <label htmlFor="tel">Phone Number</label>
        <input
          type="text"
          value={tel}
          onChange={(e) => setTel(() => e.target.value)}
        />
        <button onClick={() => handleUser()}>Update Phone Number</button>
      </form>
    </div>
  );
};
export const API: React.FC<{ setError: (e: string) => void }> = ({
  setError,
}) => {
  const { user } = useUserContext();

  const [pages, setPages] = useState<number>(1);
  const [key, setKey] = useState<string>("");
  const [coinName, setCoinName] = useState<string>("");
  const [ApiKeys, setApiKeys] = useState<APIKeyResponseType[]>([]);
  const [cryptos, setCryptos] = useState<CryptoResponseType[]>([]);

  const makeApiKey = async () => {
    setError("Please wait ...");
    const { success, message } = await postRequest(
      apikeysUrl,
      {
        coinName,
        key,
      },
      user?.token
    );

    showError(setError, message);
    if (success) location.reload();
  };
  const deleteKey = async (id: string) => {
    setError("Please wait ...");
    const { message, success } = await deleteRequest(
      `${apikeysUrl}${id}`,

      user?.token
    );

    showError(setError, message);
    if (success) location.reload();
  };
  const fetchData = async (page: number = 1) => {
    try {
      const { data } = await getRequest(
        `${apikeysUrl}?page=${page}`,
        user?.token
      );
      const { data: cs } = await getRequest(
        `${cryptosUrl}?custom=true`,
        user?.token
      );
      setApiKeys(() => data.data);
      setPages(() => data.pages);
      const filtered = cs.data.filter((coin: CryptoResponseType) => {
        const found = data.data.find(
          (key: APIKeyResponseType) => key.coinName == coin.symbol
        );
        if (
          !found &&
          (coin.companyName == user?.companyName || user?.role == 2)
        ) {
          return coin;
        }
      });
      setCryptos(() => filtered);
      setCoinName(() => filtered[0]?.symbol || "");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.token) fetchData();
  }, [user?.token]);

  return (
    <div className={styles.api}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          makeApiKey();
        }}
      >
        <h1>Create API Key</h1>
        <label htmlFor="coin">Coin</label>
        <select
          value={coinName}
          onChange={(e) => setCoinName(() => e.target.value)}
        >
          {cryptos.map((crypto) => (
            <option value={crypto.symbol} key={crypto._id}>
              {crypto.name}
            </option>
          ))}
        </select>
        {user?.role == 2 && (
          <div className={styles.column}>
            <label htmlFor="key">Key</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(() => e.target.value)}
            />
          </div>
        )}
        <button disabled={coinName.length < 1}>Create API Key</button>
      </form>
      <span className={styles.vSpacer}></span>
      <div className={styles.table}>
        <div className={styles.row}>
          <h1>API KEYS</h1>
        </div>
        <div className={styles.row}>
          {user?.role == 2 && <span>Username</span>}
          <span>Coin Name</span>
          <span>Key</span>
          {user?.role == 2 && <span>Delete</span>}
        </div>

        {ApiKeys.map((key) => (
          <div className={styles.row} key={key._id}>
            {user?.role == 2 && <span>{key.username.toUpperCase()}</span>}
            <span>{key.coinName.toUpperCase()}</span>
            <span
              onClick={(e) => {
                navigator.clipboard.writeText(key.key);
                const element = e.target as HTMLSpanElement;
                element.innerText = "Copied!";
                setTimeout(() => (element.innerText = key.key), 3000);
              }}
            >
              {key.key}
            </span>
            {user?.role == 2 && (
              <span className={"action2"} onClick={() => deleteKey(key._id)}>
                Delete
              </span>
            )}
          </div>
        ))}
        {ApiKeys.length == 0 && <h1>You do not have any APIKEY yet</h1>}
      </div>

      <Paginate pages={pages} action={fetchData} />
    </div>
  );
};
export const BankInfo: React.FC<{
  setError: (e: string) => void;
  walletz: WalletResponseType[];
  accounts: BankInfoResponseType[];
}> = ({ setError, walletz, accounts }) => {
  const { user } = useUserContext();

  const [accName, setAccName] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [accNo, setAccNo] = useState<string>("");

  const [wallets, setWallets] = useState<WalletResponseType[]>(walletz);

  const addAccount = async () => {
    setError("Please wait ...");
    const { message, success } = await postRequest(
      banksUrl,
      {
        accName,
        accNo,
        bankName,
      },
      user?.token
    );

    showError(setError, message);
    if (success) location.reload();
  };
  const deleteAccount = async (id: string) => {
    setError("Please wait ...");
    const { success, message } = await deleteRequest(
      `${banksUrl}${id}`,

      user?.token
    );

    showError(setError, message);
    if (success) location.reload();
  };
  const updateWallet = async (id: string) => {
    if (user?.role != 2) return;
    setError("Please wait ...");
    const addressCont = document.getElementById(`${id}`) as HTMLInputElement;
    const address = addressCont.value;

    const { success, message } = await putRequest(
      `${walletsUrl}${id}`,
      { address },
      user.token
    );

    showError(setError, message);
    if (success) {
      setWallets((e) =>
        e.map((wallet) => {
          wallet.address = wallet._id == id ? address : wallet.address;
          return wallet;
        })
      );
    }
  };

  return (
    <div className={styles.bankInfo}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addAccount();
        }}
      >
        <h1>Add Payment Info</h1>
        <label htmlFor="">Bank Name</label>
        <input
          type="text"
          value={bankName}
          onChange={(e) => setBankName(() => e.target.value)}
        />
        <label htmlFor="">Account Name</label>
        <input
          type="text"
          value={accName}
          onChange={(e) => setAccName(() => e.target.value)}
        />
        <label htmlFor="">Account Number</label>
        <input
          type="text"
          value={accNo}
          onChange={(e) => setAccNo(() => e.target.value)}
        />
        <button>Add Account</button>
      </form>
      <span className={styles.vSpacer}></span>
      <div className={styles.table}>
        <div className={styles.row}>
          <h1>Payment Options</h1>
        </div>
        <div className={styles.row}>
          <span>Bank Name</span>
          <span>Account Name</span>
          <span>Account No</span>
          <span>Action</span>
        </div>

        {accounts.map((account) => (
          <div className={styles.row} key={account._id}>
            <span>{account.bankName}</span>
            <span>{account.accName}</span>
            <span>{account.accNo}</span>

            <span
              className={"action2"}
              onClick={() => deleteAccount(account._id)}
            >
              Delete
            </span>
          </div>
        ))}
        {accounts.length == 0 && (
          <h1>You do not have any payment option yet</h1>
        )}
      </div>
      <span className={styles.vSpacer}></span>
      {wallets.length > 0 && user?.role == 2 && (
        <div className={styles.table}>
          {wallets.map((wallet) => (
            <div className={styles.row} key={wallet._id}>
              <span>{wallet.coinName.toUpperCase()}</span>
              <input defaultValue={wallet.address} id={`${wallet._id}`} />

              {wallet.coinName != "ruba" && (
                <span
                  className={"action2"}
                  onClick={() => updateWallet(wallet._id)}
                >
                  Update
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BasicData;
