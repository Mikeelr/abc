"use client";
import { useEffect, useState } from "react";

import styles from "./styles.module.scss";
import Link from "next/link";
import { useUserContext } from "@/app/components/js/Wrapper";
import { uploadBlogImage } from "@/app/components/js/firebaseconfig";
import { blogUrl } from "@/app/components/js/config";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/app/components/js/api_client";
import showError from "@/app/components/js/showError";
import { BlogResponseType } from "@/app/components/js/dataTypes";
import Spinner from "@/app/components/js/spinner/Spinner";
import Paginate from "@/app/components/js/paginate/Paginate";
import { useRouter } from "next/navigation";
export const CreatePost: React.FC = () => {
  const { user } = useUserContext();

  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [abstract, setAbstract] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCreate = async () => {
    setError("Please wait ...");
    const images = await uploadBlogImage(title, "form");

    const { message, success } = await postRequest(
      blogUrl,
      {
        title,
        body: body.split("\n"),
        author,
        abstract,
        images,
      },
      `${user?.token}`
    );
    showError(setError, message);
    if (success) {
      location.replace("/dashboard/blog");
    }
  };

  return (
    <div className={styles.blog}>
      <h1>Create Blog Post</h1>
      <div className={styles.box}>
        <form id="form">
          <label htmlFor="name">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(() => e.target.value)}
          />
          <label htmlFor="">author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(() => e.target.value)}
          />
          <label htmlFor="">Abstract</label>
          <textarea
            value={abstract}
            onChange={(e) => setAbstract(() => e.target.value)}
          />
          <label htmlFor="">Full Text</label>
          <textarea
            value={body}
            onChange={(e) => setBody(() => e.target.value)}
          />

          <div className={styles.column}>
            <div className={`${styles.row} images`}>
              <input type="file" accept="image/*" />
              <input type="text" placeholder="Ref" />
            </div>
            <div className={`${styles.row} images`}>
              <input type="file" accept="image/*" />
              <input type="text" placeholder="Ref" />
            </div>
            <div className={`${styles.row} images`}>
              <input type="file" accept="image/*" />
              <input type="text" placeholder="Ref" />
            </div>
            <div className={`${styles.row} images`}>
              <input type="file" accept="image/*" />
              <input type="text" placeholder="Ref" />
            </div>
          </div>
          <button
            disabled={title.length < 10}
            onClick={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            Create Post
          </button>
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};
export const Posts: React.FC<{ data: BlogResponseType[]; pages: number }> = ({
  data,
  pages,
}) => {
  const { user } = useUserContext();
  const [posts, setPosts] = useState<BlogResponseType[]>(data);
  const [error, setError] = useState("");

  const fetchData = async (page: number) => {
    const { data } = await getRequest(
      `${blogUrl}?page=${page}&all=true`,
      user?.token
    );
    setPosts(data?.data || []);
  };

  const handleDelete = async (post: BlogResponseType) => {
    setError("Please wait ...");
    const { success, message } = await deleteRequest(
      `${blogUrl}${post._id}`,

      user?.token
    );
    if (success) setPosts((e) => e.filter((po) => po._id != post._id));
    showError(setError, message);
  };

  return (
    <div className={styles.blog}>
      <h1>Blog Posts</h1>
      <Link className={"action2"} href={`/dashboard/blog/create`}>
        New Post
      </Link>
      <div className={styles.table}>
        <div className={styles.row}>
          <span>Title</span>
          <span>Edit</span>
          <span>Delete</span>
        </div>
        {posts.map((post) => (
          <div key={post._id} className={styles.row}>
            <span>{post.title}</span>

            <Link className={"action2"} href={`/dashboard/blog/${post._id}`}>
              Edit
            </Link>
            <span className={"action2"} onClick={() => handleDelete(post)}>
              Delete
            </span>
          </div>
        ))}
      </div>
      {posts.length == 0 && <h1>No Blog Posts Yet</h1>}

      <Paginate pages={pages} action={fetchData} />
      {error && <Spinner error={error} />}
    </div>
  );
};
export const UpdatePost: React.FC<{ data: BlogResponseType }> = ({
  data: post,
}) => {
  const { user } = useUserContext();

  const router = useRouter();

  const [error, setError] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [abstract, setAbstract] = useState<string>("");

  const handlePost = async () => {
    setError("Please wait ...");

    const images = await uploadBlogImage(title, "form");
    const { success, message } = await putRequest(
      `${blogUrl}${post?._id}`,
      {
        body: body.split("\n"),
        author,
        abstract,
        images,
      },
      user?.token
    );
    if (success) router.replace("/dashboard/blog");
    showError(setError, message);
  };
  const handleDelete = async () => {
    setError("Please wait ...");

    const { success } = await deleteRequest(
      `${blogUrl}${post._id}`,

      user?.token
    );

    if (success) router.replace("/dashboard/blog");
    showError(setError, "Success");
  };

  useEffect(() => {
    if (post) {
      setTitle(() => post.title);
      setAbstract(() => post.abstract);
      setAuthor(() => post.author);
      let bd = "";
      post.body.forEach((p) => (bd += `${p}\n`));
      setBody(() => bd);
    }
  }, [post._id]);

  return (
    <div className={styles.blog}>
      <h1>Update {post.title}</h1>
      <div className={styles.box}>
        <form id="form">
          <label htmlFor="name">Title</label>
          <input type="text" value={title} disabled />
          <label htmlFor="">author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(() => e.target.value)}
          />
          <label htmlFor="">Abstract</label>
          <textarea
            value={abstract}
            onChange={(e) => setAbstract(() => e.target.value)}
          />
          <label htmlFor="">Full Text</label>
          <textarea
            value={body}
            onChange={(e) => setBody(() => e.target.value)}
          />

          <div className={styles.column}>
            {post.images.map((img, i) => (
              <div className={`${styles.row} images`} key={i}>
                <input
                  type="file"
                  accept="image/*"
                  aria-describedby={img.img}
                />
                <input type="text" placeholder="Ref" defaultValue={img.ref} />
              </div>
            ))}
            {post.images.length < 4 && (
              <div className={`${styles.row} images`}>
                <input type="file" accept="image/*" />
                <input type="text" placeholder="Ref" />
              </div>
            )}
          </div>
          <button
            disabled={title.length < 10}
            onClick={(e) => {
              e.preventDefault();
              handlePost();
            }}
          >
            Update Post
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            Delete Post
          </button>
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};

export default Posts;
