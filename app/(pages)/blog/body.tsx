"use client";
import { BlogResponseType } from "@/app/components/js/dataTypes";
import styles from "./styles.module.scss";
import Paginate from "@/app/components/js/paginate/Paginate";
import { useRouter } from "next/navigation";
import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";
import BlogPosts from "@/app/components/js/blog/Blog";

export default function Body({
  data,
}: {
  data: { data: BlogResponseType[]; pages: number };
}) {
  const router = useRouter();
  const top: TopperType = {
    title: "Our Blog",
    img: "/assets/laptop.webp",
    text: ["Latest updates and crypto news from our blog"],
  };
  const loadPage = async (page: number) => {
    router.replace(`/blog?page=${page}`);
  };
  return (
    <div className={styles.main}>
      <Topper data={top} />
      <BlogPosts posts={data.data} />
      <Paginate action={loadPage} pages={data.pages} />
    </div>
  );
}
