"use client";
import styles from "./Kyc.module.scss";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/components/js/Wrapper";
import { IDTYPES, KYCResponseType } from "@/app/components/js/dataTypes";
import {
  getRequest,
  postRequest,
  putRequest,
} from "@/app/components/js/api_client";
import { kycsUrl } from "@/app/components/js/config";
import showError from "@/app/components/js/showError";
import { Countries } from "@/app/components/js/countries";
import Spinner from "@/app/components/js/spinner/Spinner";
import Link from "next/link";
import Paginate from "@/app/components/js/paginate/Paginate";

export const Kyc: React.FC = () => {
  const { user } = useUserContext();
  const [idNo, setIdNo] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [idType, setIdType] = useState<string>(IDTYPES[0]);
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("Please wait...");
    const { message, success } = await postRequest(
      kycsUrl,
      { idType, idNo, country },
      user?.token
    );

    if (success) {
      showError(
        setError,
        "Your KYC has been submitted. Please wait for our admins to approve your data."
      );
      router.replace("/dashboard");
      return;
    }
    showError(setError, message);
  };

  return (
    <div className={styles.kyc}>
      {user?.verified ? (
        <div className={styles.verified}>
          <h1>KYC Verification</h1>
          <h3>Congratulations! you have completed your KYC verification</h3>
          <Link href={"/dashboard"} className="action2">
            Dashboard
          </Link>
        </div>
      ) : (
        <div className={styles.box}>
          <h1>KYC Verification</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="idNo">ID No</label>
            <input
              type="text"
              value={idNo}
              onChange={(e) => setIdNo(() => e.target.value)}
            />
            <label htmlFor="idType">ID Type</label>
            <select
              id="idType"
              value={idType}
              onChange={(e) => setIdType(() => e.target.value)}
            >
              {IDTYPES.map((id) => (
                <option value={id} key={id}>
                  {id}
                </option>
              ))}
            </select>
            <label htmlFor="country">Country</label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(() => e.target.value)}
            >
              <option value={""}>Select</option>
              {Countries.map((id) => (
                <option value={id} key={id}>
                  {id}
                </option>
              ))}
            </select>
            <button disabled={idNo.length < 6}>Submit KYC</button>
          </form>
        </div>
      )}
      {error && <Spinner error={error} />}
    </div>
  );
};

export const Kycs: React.FC<{ kycData: KYCResponseType[]; pages: number }> = ({
  kycData,
  pages,
}) => {
  const { user } = useUserContext();
  const router = useRouter();
  const [kycs, setKycs] = useState<KYCResponseType[]>(kycData);

  const [error, setError] = useState<string>("");
  const fetchData = async (page: number) => {
    const { data, success } = await getRequest(
      `${kycsUrl}?all=true&page=${page}`,
      user?.token
    );
    if (success) {
      setKycs(data.data);
    }
  };
  const handleStatus = async (id: string, status: number) => {
    setError("Please wait...");

    const { success, message } = await putRequest(
      `${kycsUrl}${id}`,
      { status },
      user?.token
    );

    if (success) location.reload();
    showError(setError, message);
  };

  return (
    <div className={styles.kyc}>
      <h1>KYC Verification</h1>
      <div className={styles.table}>
        <div className={styles.row}>
          <span>Date</span>

          <span>Username</span>
          <span>ID Type</span>
          <span>ID No</span>
          <span>Country</span>
          <div>
            <span> Action</span>
          </div>
        </div>
        {kycs.map((kyc) => (
          <div key={kyc._id} className={styles.row}>
            <span>{kyc.createdAt.split("T")[0]}</span>
            <span>{kyc.username?.toUpperCase()}</span>
            <span>{kyc.idType}</span>
            <span
              onClick={(e) => {
                const target = e.target as HTMLSpanElement;
                navigator.clipboard.writeText(kyc.idNo);
                target.innerText = "Copied";
                setTimeout(() => {
                  target.innerText = kyc.idNo;
                }, 2000);
              }}
            >
              {kyc.idNo}
            </span>
            <span>{kyc.country}</span>

            <div>
              <button
                onClick={() => handleStatus(kyc._id, 1)}
                disabled={kyc.status == 1}
              >
                Approve
              </button>
              <button
                onClick={() => handleStatus(kyc._id, -1)}
                disabled={kyc.status == -1}
              >
                Disapprove
              </button>
            </div>
          </div>
        ))}
      </div>
      {kycs.length == 0 && (
        <h3>
          Congratulations! you have attended to all pending KYC Submission
        </h3>
      )}

      <Paginate pages={pages} action={fetchData} />
      {error && <Spinner error={error} />}
    </div>
  );
};

export default Kycs;
