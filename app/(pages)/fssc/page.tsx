"use client";
import { useState, useEffect } from "react";
import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";
import styles from "./styles.module.scss";
import {
  FSSCResponseType,
  UserResponseType,
} from "@/app/components/js/dataTypes";
import { getRequest } from "@/app/components/js/api_client";
import { fsscsUrl } from "@/app/components/js/config";
import showError from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function FSSC() {
  const top: TopperType = {
    img: "/assets/identity.jpeg",
    text: [
      "Your FSSC Number is your unique Identification number, that authorizes you to enjoy exclusive benefits on the RUBA ecosystem.",
      "Search our existing records below or create an account to get started",
    ],
    title: "FSSC Portal",
  };
  const [FSSCNo, setFSSCNo] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [FSSCData, setFSSCData] = useState<FSSCResponseType | null>(null);
  const [user, setUser] = useState<UserResponseType | null>(null);
  const searchParams = useSearchParams();
  async function handleSearch(fsscNo: string) {
    const { success, data } = await getRequest(`${fsscsUrl}?FSSCNo=${fsscNo}`);
    if (!success) {
      showError(setMessage, "No identity associated with this FSSC No");
      return;
    }
    setFSSCData(data.fssc);
    setUser(data.user);
  }
  useEffect(() => {
    const fsscNo = searchParams.get("FSSCNo");
    if (fsscNo) {
      handleSearch(fsscNo);
    }
  }, [searchParams.get("FSSCNo")]);

  const Info = ({ text, value }: { text: string; value: string }) => (
    <div className={styles.info}>
      <span>{text}:</span>
      <span>{value}</span>
    </div>
  );
  const formatDate = (text: string) => {
    const date = new Date(text);
    return date;
  };
  return (
    <main>
      <Topper data={top} />
      <div className={styles.main}>
        {user && FSSCData ? (
          <div className={styles.data}>
            <div className={styles.image}>
              <div className={styles.box}>
                <Image src={FSSCData.img} fill alt={FSSCData.FSSCNo} />
              </div>
            </div>
            <p className={styles.number}>{FSSCData.FSSCNo}</p>
            <Info value={user.sName + " " + user.oNames} text="Full name" />
            <Info value={FSSCData.state} text="Operating State" />
            <Info value={FSSCData.country} text="Operating Country" />
            <Info
              value={`${formatDate(FSSCData.dob)
                .toDateString()
                .substring(0, 13)}**`}
              text="Date of Birth"
            />
            <Info
              value={
                FSSCData.status == 0
                  ? "Pending"
                  : FSSCData.status == 1
                  ? "Member"
                  : "Expired"
              }
              text="Membership status"
            />
            <span
              className="action"
              onClick={() => {
                setUser(null);
                setFSSCData(null);
                setFSSCNo("");
              }}
            >
              Reset
            </span>
          </div>
        ) : (
          <div className={styles.search}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(FSSCNo);
              }}
            >
              <label>Enter FSSC Number</label>
              <input
                type="text"
                value={FSSCNo}
                onChange={(e) => setFSSCNo(e.target.value)}
              />
              <button className="action" disabled={FSSCNo.length != 10}>
                Search
              </button>
            </form>
          </div>
        )}
      </div>
      {message && <Spinner error={message} />}
    </main>
  );
}
