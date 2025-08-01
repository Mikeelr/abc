import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./Event.module.scss";
import { AiOutlineStar } from "react-icons/ai";
import { EventResponseType } from "../dataTypes";
export default function EventPosts() {
  const [events, setEvents] = useState<EventResponseType[]>([]);
  const [lEvent, setLEvent] = useState<EventResponseType>();
  const now = new Date();
  const [date, setDate] = useState<Date>(now);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}events`
        );
        setDate(() => {
          const da = new Date(data.data[data.data.length - 1]?.date);

          return da;
        });
        setLEvent(data.data[data.data.length - 1]);
        setEvents(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const roller = document.querySelector("#roller") as HTMLDivElement;
    const body = document.querySelector("body");

    if (roller) {
      const width = roller.getBoundingClientRect().width;
      const deviceWidth = body!.getBoundingClientRect().width;
      roller.style.setProperty("--duration", `${width / 63}s`);
      roller.style.setProperty("--move", `${width - deviceWidth / 1.5}px`);
    }
  });

  return (
    <div className={styles.events}>
      <p>UPCOMING EVENTS</p>
      {events.length ? (
        <div className={styles.container}>
          <div className={styles.roller} id="roller">
            <div className={styles.event}>
              <div className={styles.date}>
                <span>
                  {date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()}
                </span>
                <span>
                  {date.getMonth() + 1 < 9
                    ? `0${date.getMonth() + 1}`
                    : date.getMonth() + 1}
                </span>
                <span>{date.getFullYear()}</span>
              </div>
              <p>{lEvent?.title}</p>
              <AiOutlineStar className={styles.icon} />
            </div>
            {events.map((event) => {
              const date = new Date(event.date);
              return (
                <div className={styles.event} key={event._id}>
                  <div className={styles.date}>
                    <span>
                      {date.getDate() < 9
                        ? `0${date.getDate()}`
                        : date.getDate()}
                    </span>
                    <span>
                      {date.getMonth() + 1 < 9
                        ? `0${date.getMonth() + 1}`
                        : date.getMonth() + 1}
                    </span>
                    <span>{date.getFullYear()}</span>
                  </div>
                  <p>{event.title}</p>
                  <AiOutlineStar className={styles.icon} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <h1>No Upcoming Event!</h1>{" "}
        </div>
      )}
    </div>
  );
}
