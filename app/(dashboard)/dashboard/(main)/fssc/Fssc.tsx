"use client";

import { useEffect, useState, FormEvent } from "react";

import styles from "./styles.module.scss";
import Link from "next/link";
import {
  getRequest,
  postRequest,
  putRequest,
} from "@/app/components/js/api_client";
import { fsscsUrl } from "@/app/components/js/config";
import { useUserContext } from "@/app/components/js/Wrapper";
import { FSSCResponseType } from "@/app/components/js/dataTypes";
import { uploadFile } from "@/app/components/js/firebaseconfig";
import showError from "@/app/components/js/showError";
import { Countries } from "@/app/components/js/countries";
import Paginate from "@/app/components/js/paginate/Paginate";

export const DashboardFSSC: React.FC<{
  setError: (e: string) => void;
  fssc: FSSCResponseType;
}> = ({ setError, fssc: data }) => {
  const { user } = useUserContext();

  const [dob, setDob] = useState<string>("");
  const [country, setCountry] = useState<string>("Yoruba Nation");
  const [FSSCNo, setFSSCNo] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [individual, setIndividual] = useState<boolean>(true);
  const [fssc, setFssc] = useState<FSSCResponseType>(data);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("Please wait...");
    const img = await uploadFile(`fssc ${user?.username}`, "form");
    const { data, message } = fssc
      ? await putRequest(
          `${fsscsUrl}${fssc._id}`,
          { dob, country, state, individual, img: img[0] },
          user?.token
        )
      : await postRequest(
          fsscsUrl,
          { dob, country, state, individual, img: img[0] },
          user?.token
        );
    showError(setError, message);

    if (data != null) setFssc(data);
  };

  useEffect(() => {
    if (fssc) {
      setFSSCNo(() => fssc.FSSCNo);
      setDob(() => fssc.dob);
      setDob(() => fssc.dob);
      setCountry(() => fssc.country);
      setState(() => fssc.state);
      setIndividual(() => fssc.individual);
    }
  }, [fssc]);

  return (
    <div className={styles.box}>
      <h1>{fssc ? "Update your info" : "Request FSSC"}</h1>
      {fssc ? (
        <form onSubmit={handleSubmit} id="form">
          <label htmlFor="idNo">FSSC No</label>
          <input type="text" value={FSSCNo} disabled={true} />
          {fssc.status == -1 && <span>Failed</span>}
          {fssc.status == 0 && <span>Pending</span>}
          {fssc.status == 1 && <span>Approved</span>}
          <label>Dob</label>
          <input
            type="datetime"
            value={dob}
            onChange={(e) => setDob(() => e.target.value)}
          />

          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(() => e.target.value)}
          >
            {Countries.map((id) => (
              <option value={id} key={id}>
                {id}
              </option>
            ))}
          </select>
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <label htmlFor="picture">Passport Photograph</label>
          <input
            type="file"
            id="picture"
            accept="image/*"
            aria-describedby={fssc.img}
          />

          <button>Update FSSC</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} id="form">
          <label htmlFor="Dob">Date of birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(() => e.target.value)}
          />

          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(() => e.target.value)}
          >
            {Countries.map((id) => (
              <option value={id} key={id}>
                {id}
              </option>
            ))}
          </select>
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <label htmlFor="picture">Passport Photograph</label>
          <input type="file" id="picture" accept="image/*" />

          <button>Request FSSC</button>
        </form>
      )}
    </div>
  );
};

export const DashboardFSSCs: React.FC<{
  FSSCs: FSSCResponseType[];
  pages: number;
}> = ({ FSSCs: data, pages }) => {
  const { user } = useUserContext();

  const [FSSCs, setFSSCs] = useState<FSSCResponseType[]>(data);

  const fetchData = async (page: number) => {
    const { data } = await getRequest(
      `${fsscsUrl}?all=true&page=${page}`,
      user?.token
    );

    if (data) setFSSCs(data.data);
  };

  return (
    <div className={styles.list}>
      <h1>View FSSCs</h1>
      <div className={styles.table}>
        <div className={styles.row}>
          <span>Date</span>

          <span>Username</span>

          <span>FSSC No</span>
          <span>DOB</span>
          <span>Status</span>
          <span>Image</span>
          <span>View</span>
        </div>
        {FSSCs.map((fssc) => (
          <div key={fssc._id} className={styles.row}>
            <span>{fssc.createdAt.split("T")[0]}</span>
            <span>{fssc.username?.toUpperCase()}</span>
            <span
              onClick={(e) => {
                const target = e.target as HTMLSpanElement;
                navigator.clipboard.writeText(fssc.FSSCNo);
                target.innerText = "Copied";
                setTimeout(() => {
                  target.innerText = fssc.FSSCNo;
                }, 2000);
              }}
            >
              {fssc.FSSCNo}
            </span>
            <span>{fssc.dob}</span>

            {fssc.status == 0 && <span>Pending</span>}
            {fssc.status == 1 && <span>Approved</span>}
            {fssc.status == -1 && <span>Declined</span>}

            <Link href={fssc.img} target="_blank" className="action2">
              View Image
            </Link>
            <Link
              href={`/fssc?FSSCNo=${fssc.FSSCNo}`}
              target="_blank"
              className="action2"
            >
              View FSSC
            </Link>
          </div>
        ))}
      </div>
      {FSSCs.length == 0 && (
        <h3>
          Congratulations! you have attended to all pending FSSC Submission
        </h3>
      )}

      <Paginate pages={pages} action={fetchData} />
    </div>
  );
};

export default DashboardFSSCs;
