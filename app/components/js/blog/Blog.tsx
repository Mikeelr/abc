import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CgArrowsExpandUpRight } from "react-icons/cg";
import styles from "./Blog.module.scss";
import { BlogResponseType } from "../dataTypes";

interface PageProps {
  posts: BlogResponseType[];
}
interface PageProp {
  post: BlogResponseType;
}
const BlogPosts: React.FC<PageProps> = ({ posts }) => {
  return (
    <div className={styles.blog}>
      <div className={styles.top}>
        <h1>From the blog</h1>
        <p>Recent blog posts from the blog</p>
      </div>
      <div className={styles.blogPosts} id="posts">
        {posts.map((post) => (
          <BlogPost key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};
export const BlogPost: React.FC<PageProp> = ({ post }) => {
  const abstract = post.abstract.slice(0, 200);
  const date = new Date(post.createdAt);
  return (
    <div className={styles.blogPost}>
      <div className={styles.img}>
        <Image src={post.images[0].img} fill alt={post.title} />
      </div>
      <div className={styles.bottom}>
        <p className={styles.title}>{post.title}</p>
        <p className={styles.info}>
          <span>{date.toDateString()}</span>

          <Link href={`/blog?author=${post.author}`}>{post.author}</Link>
        </p>
        <p>
          {abstract}...
          <Link href={`/blog/${post.title}`} className={styles.link}>
            <span>Read More</span>
            <CgArrowsExpandUpRight />
          </Link>
        </p>
      </div>
    </div>
  );
};
export default BlogPosts;
