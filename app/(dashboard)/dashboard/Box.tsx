"use client";
import { ReactNode, useState } from "react";
import styles from "./Box.module.scss";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { BiArrowBack, BiCalendarEvent, BiTransferAlt } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi";
import { RiLuggageDepositLine, RiUserSearchLine } from "react-icons/ri";
import { SiConvertio } from "react-icons/si";
import { BsSend } from "react-icons/bs";
import { GiGroundSprout, GiShakingHands } from "react-icons/gi";

import { MdAccountCircle } from "react-icons/md";
import { TbBrandBlogger } from "react-icons/tb";
import { useUserContext } from "@/app/components/js/Wrapper";
import { COMPANYNAME, usersUrl } from "@/app/components/js/config";
import { putRequest } from "@/app/components/js/api_client";
import showError from "@/app/components/js/showError";
import Ticker from "@/app/components/js/Ticker";
import Spinner from "@/app/components/js/spinner/Spinner";
interface LinkProp {
  name: string;
  link: string;
  icon: IconType;
}
const Box: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { user, logout } = useUserContext();
  const adminLinks: LinkProp[] = [
    {
      name: "Transactions",
      link: "/dashboard/transactions",
      icon: BiTransferAlt,
    },
    {
      name: "Conversion",
      link: "/dashboard/conversion",
      icon: SiConvertio,
    },
    {
      name: "Investment",
      link: "/dashboard/investments",
      icon: GiGroundSprout,
    },
    {
      name: "Members",
      link: "/dashboard/members",
      icon: HiOutlineUsers,
    },
    {
      name: "P2P",
      link: "/dashboard/p2p",
      icon: RiUserSearchLine,
    },

    {
      name: "Blog",
      link: "/dashboard/blog",
      icon: TbBrandBlogger,
    },
    // {
    //   name: "Events",
    //   link: "/dashboard/events",
    //   icon: BiCalendarEvent,
    // },
  ];
  const userLinks: LinkProp[] = [
    {
      name: "Send",
      link: "/dashboard/send",
      icon: BsSend,
    },
    {
      name: "Deposit",
      link: "/dashboard/deposit",
      icon: RiLuggageDepositLine,
    },
    {
      name: "Convert",
      link: "/dashboard/conversion",
      icon: SiConvertio,
    },
    {
      name: "P2P",
      link: "/dashboard/p2p",
      icon: GiShakingHands,
    },
    {
      name: "Invest",
      link: "/dashboard/investments",
      icon: GiGroundSprout,
    },
    {
      name: "Account",
      link: "/dashboard/account",
      icon: MdAccountCircle,
    },
  ];
  const topLinks: { link: string; name: string }[] = [
    {
      link: "/dashboard",
      name: "Dashboard",
    },
    {
      link: "/dashboard/bank",
      name: "Apex Bank Portal",
    },
    {
      link: "/dashboard/transactions",
      name: "All Transactions",
    },
    {
      link: "/dashboard/fssc",
      name: "FSSC Portal",
    },
  ];
  const [error, setError] = useState<string>("");
  const handleVerify = async () => {
    setError("Sending...");
    const { message, success } = await putRequest(
      `${usersUrl}${user?._id}`,
      {
        sendVerification: true,
      },
      `${user?.token}`
    );
    showError(
      setError,
      success ? "We have resent the verification link" : message
    );
  };
  return (
    <div className={styles.box}>
      {error && <Spinner error={error} />}

      <div className={styles.top}>
        <div className={styles.first}>
          <span
            className={styles.tAction}
            onClick={() => {
              window.history.back();
            }}
          >
            <BiArrowBack />
          </span>
          <h1>{`WELCOME ${user?.username.toUpperCase()}`}</h1>
          <h1>{COMPANYNAME} DASHBAORD</h1>
        </div>
        <div className={styles.price}>
          <Ticker theme="dark" />
        </div>
        <div className={styles.last}>
          {topLinks.map((link, i) => (
            <Link href={link.link} key={i}>
              {link.name}
            </Link>
          ))}
          {(user?.role == 2 || user?.role == 1) && (
            <Link href={"/dashboard/crypto"}>Crypto</Link>
          )}
          {(!user?.verified || user.role == 2) && (
            <Link href={"/dashboard/kyc"}>KYC PORTAL</Link>
          )}
          {!user?.emailVerified && (
            <button onClick={handleVerify}>Resend Verification</button>
          )}
          {user?.role == 2 ? (
            <Link href={"/dashboard/account"}>Account</Link>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
        </div>
      </div>
      <div className={styles.center}>{children}</div>
      <div className={styles.bottom}>
        {user?.role == 2
          ? adminLinks.map((link, i) => (
              <Link href={link.link} key={i}>
                <span>{link.name}</span>
                <link.icon className={styles.icon} />
              </Link>
            ))
          : userLinks.map((link, i) => (
              <Link href={link.link} key={i}>
                <span>{link.name}</span>
                <link.icon className={styles.icon} />
              </Link>
            ))}
      </div>
    </div>
  );
};

export default Box;
