import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";
import { BlogResponseType } from "@/app/components/js/dataTypes";
import Image from "next/image";
import styles from "./post.module.scss";

export default function Blog({ post }: { post: BlogResponseType }) {
  const topperData: TopperType = {
    title: `${post.title}`,
    img: post.images[0].img,

    text: post.abstract.split("."),
  };
  const date = new Date(post.createdAt);
  const poped = post.images.slice(1);
  return (
    <div>
      <Topper data={topperData} />
      <div className={styles.container}>
        <div className={styles.top}>
          <h1>{post.title}</h1>
          <p style={{ display: "flex", gap: "20px" }}>
            <span>{post.author}</span>
            <span>{date.toDateString()}</span>
          </p>
          <p>{post.abstract}</p>
        </div>
        <div className={styles.center}>
          <div className={styles.img}>
            <Image src={post.images[0].img} fill alt={post.title} />
          </div>
          {post.images[0].ref && <p>Copyrite:{post.images[0].ref} </p>}
        </div>
        <div className={styles.bottom}>
          <div className={styles.text}>
            {post.body.map((po, i) => (
              <div key={i}>
                <p>{po}</p>
              </div>
            ))}
          </div>
          <div className={styles.images}>
            {poped.map((img, i) => (
              <div key={i} className={styles.box}>
                <div className={styles.img}>
                  <Image src={img.img} fill alt={post.title} />
                </div>
                {img.ref && <p>Copyrite: {img.ref}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
