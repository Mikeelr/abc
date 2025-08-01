"use client";
import { useUserContext } from "@/app/components/js/Wrapper";
import styles from "./styles.module.scss";
import DashboardFSSCs, { DashboardFSSC } from "./Fssc";
import { useState } from "react";
import Spinner from "@/app/components/js/spinner/Spinner";
import { FSSCResponseType } from "@/app/components/js/dataTypes";
export default function Body({
  fssc,
  fsscs,
  pages,
}: {
  fssc: FSSCResponseType;
  fsscs: FSSCResponseType[];
  pages: number;
}) {
  const { user } = useUserContext();
  const [error, setError] = useState<string>("");
  return (
    <div className={styles.main}>
      <h1>FSSC Portal</h1>
      <div className={styles.grid}>
        <DashboardFSSC fssc={fssc} setError={setError} />
        {user?.role == 2 && <DashboardFSSCs FSSCs={fsscs} pages={pages} />}
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
}
