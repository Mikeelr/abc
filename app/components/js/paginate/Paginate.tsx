"use client";
import { useEffect, useState } from "react";
import styles from "./paginate.module.scss";
const Paginate: React.FC<{ pages: number; action: (page: number) => void }> = ({
  pages,
  action,
}) => {
  const [page, setPage] = useState<number>(1);
  const [currentShow, setCurrentShow] = useState<number>(0);
  const [len, setLen] = useState<number>(1);
  const [mPages, setMPages] = useState<number[][]>([]);
  useEffect(() => {
    const length = Math.ceil(pages / 10);

    setLen(() => length);
    let pags: number[][] = [];
    for (let i = 1; i <= length; i++) {
      const group: number[] = [];
      let ig = (i - 1) * 10;

      for (let k = ig; k <= ig + 9 && k + 1 <= pages; k++) {
        group.push(k + 1);
      }
      pags.push(group);
    }

    setMPages(pags);
  }, [pages]);

  useEffect(() => {
    action(page);
  }, [page]);
  const slider = (add: boolean) => {
    if (add) {
      if (currentShow + 1 < len) {
        setPage(() => currentShow * 10 + 10 + 1);
        setCurrentShow((e) => e + 1);
      }
    } else {
      if (currentShow - 1 >= 0) {
        setCurrentShow((e) => e - 1);
        setPage(() => currentShow * 10 - 10 + 1);
      } else {
        setCurrentShow(() => 0);
        setPage(() => 1);
      }
    }
  };
  return (
    <div className={styles.pages}>
      <div className={styles.controllers}>
        <span
          onClick={(e) => {
            slider(false);
          }}
        >
          &lt;
        </span>
        <span
          onClick={(e) => {
            slider(true);
          }}
        >
          &gt;
        </span>
      </div>
      {mPages.map((mPage, i) => (
        <div
          key={i}
          className={
            currentShow == i
              ? `${styles.activeGroup} ${styles.group}`
              : styles.group
          }
        >
          {mPage.map((pg) => (
            <span
              key={pg}
              onClick={(e) => {
                setPage(pg);
              }}
              className={page == pg ? styles.active : styles.notActive}
            >
              {pg}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Paginate;
