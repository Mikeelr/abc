"use client";
import { ReactNode, useState } from "react";
import styles from "./P2PBox.module.scss";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { BiAddToQueue, BiArrowBack } from "react-icons/bi";

import { FaCampground } from "react-icons/fa";
import { GiTrade, GiWallet } from "react-icons/gi";

import { MdOutlineDashboard } from "react-icons/md";
import { CgTranscript } from "react-icons/cg";
import { createContext, useContext } from "react";
import { useUserContext } from "@/app/components/js/Wrapper";
import Ticker from "@/app/components/js/Ticker";
interface LinkProp {
  name: string;
  link: string;
  icon: IconType;
}
interface OrderContextType {
  qty: number;
  setQty: (qty: number) => void;
}
const orderContext = createContext<OrderContextType>({
  qty: 0,
  setQty: () => null,
});
export const useOrderContext = () =>
  useContext(orderContext) as OrderContextType;
const P2PBox: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUserContext();
  const [qty, setQty] = useState<number>(0);
  const links: LinkProp[] = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: MdOutlineDashboard,
    },
    {
      name: "Trade",
      link: "/dashboard/p2p",
      icon: GiTrade,
    },
    {
      name: "Orders",
      link: "/dashboard/p2p/orders",
      icon: CgTranscript,
    },
    {
      name: "Wallets",
      link: "/dashboard/p2p/wallet",
      icon: GiWallet,
    },
  ];

  return (
    <div className={styles.box}>
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
          <h1>DASHBOARD</h1>
          <h1>P2P TRADE</h1>
        </div>
        <div className={styles.price}>
          <Ticker theme="light" />
        </div>
      </div>
      <div className={styles.center}>
        {qty > 0 && (
          <span className={styles.notify}>You have {qty} pending orders</span>
        )}
        <orderContext.Provider value={{ qty, setQty }}>
          {children}
        </orderContext.Provider>
      </div>
      <div className={styles.bottom}>
        {links.map((link, i) => (
          <Link href={link.link} key={i}>
            <span>{link.name}</span>
            <link.icon className={styles.icon} />
          </Link>
        ))}
        {(user?.p2pEligible || user?.role == 2) && (
          <Link href={"/dashboard/p2p/ad"}>
            <span>Ads</span>
            <BiAddToQueue className={styles.icon} />
          </Link>
        )}
        {user?.role == 2 && (
          <Link href={"/dashboard/p2p/pairs"}>
            <span>Pair</span>
            <FaCampground className={styles.icon} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default P2PBox;
