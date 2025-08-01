import Image from "next/image";

import styles from "./Key.module.scss";
const Key = () => {
  const Keys: {
    amount: number;
    title: string;
    img: { img: string; title: string }[];
  }[] = [
    {
      title: "Dua",
      amount: 10,
      img: [
        {
          img: "10d.jpg",
          title: "Front View",
        },
        {
          img: "10db.jpg",
          title: "Back View",
        },
      ],
    },
    {
      title: "Dua",
      amount: 20,
      img: [
        {
          img: "20d.jpg",
          title: "Front View",
        },
        {
          img: "20db.jpg",
          title: "Back View",
        },
      ],
    },
    {
      title: "Dua",
      amount: 50,
      img: [
        {
          img: "50d.jpg",
          title: "Front View",
        },
        {
          img: "50db.jpg",
          title: "Back View",
        },
      ],
    },
    {
      title: "Ruba",
      amount: 1,
      img: [
        {
          img: "1.jpg",
          title: "Front View",
        },
        {
          img: "1b.jpg",
          title: "Back View",
        },
      ],
    },
    {
      title: "Ruba",
      amount: 5,
      img: [
        {
          img: "5.jpg",
          title: "Front View",
        },
        {
          img: "5b.jpg",
          title: "Back View",
        },
      ],
    },
    {
      title: "Ruba",
      amount: 10,
      img: [
        {
          img: "10.jpg",
          title: "Front View",
        },
        {
          img: "10b.jpg",
          title: "Back View",
        },
      ],
    },
    {
      title: "Ruba",
      amount: 20,
      img: [
        {
          img: "20.jpg",
          title: "Front View",
        },
        {
          img: "20b.jpg",
          title: "Back View",
        },
      ],
    },
    {
      title: "Ruba",
      amount: 50,
      img: [
        {
          img: "50.jpg",
          title: "Front View",
        },
        {
          img: "50b.jpg",
          title: "Back View",
        },
      ],
    },
  ];
  return (
    <div className={styles.keys}>
      <h1>
        Spend Ruba as a cryptocurrency or as physical currency. Which ever way
        you choose, we&apos;ve got your back!
      </h1>

      <div className={styles.row} id="currency">
        {Keys.map((key, i) => (
          <div key={i} className={styles.currency}>
            <h1>
              {key.amount} <span>{key.title}</span>{" "}
            </h1>
            <div className={styles.images}>
              {key.img.map((image, i) => (
                <div className={styles.img} key={i * 200}>
                  <p>{image.title}</p>
                  <Image
                    src={`/assets/currency/${image.img}`}
                    fill
                    alt={key.amount + " " + key.title}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Key;
