"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";
import { MailPropType } from "@/app/components/js/dataTypes";
import { postRequest } from "@/app/components/js/api_client";
import { EMAIL, EMAIL2, TEL, TEL2, mailUrl } from "@/app/components/js/config";
import Spinner from "@/app/components/js/spinner/Spinner";
import showError, { showSuccess } from "@/app/components/js/showError";

export default function Visa_Documents() {
  const data: TopperType = {
    title: "Contact Us",
    img: "/assets/blog.jpeg",
    text: [
      "Do you have any questions or complain? We advise you to use the online chat support for prompt response.",
      `Email: ${EMAIL} or ${EMAIL2}`,
      `Whatsapp: ${TEL} or ${TEL2}`,
    ],
  };
  const [message, setMessage] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [name, setName] = useState<string>("");
  const handleSubmit = async () => {
    setMessage("Please wait");
    const fMessage = `<p>${text.replaceAll("\n", "</p><p>")}</p>`;
    const prop: MailPropType = {
      emails: [
        {
          email_address: {
            address:
              process.env.NODE_ENV == "production"
                ? `${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`
                : "helpin0hand@gmail.com",
            username: "Admin",
          },
        },
      ],
      username: "Admin",
      subject,
      secret: `${process.env.NEXT_PUBLIC_SECRET2MAIL}`,
      messageData: `<p>You have a new message from ${name}.</p>${fMessage}<p>Reply to <br/> <span>Tel:\t ${tel}</span><br/><span>Email:\t ${email}</span></p>`,
    };
    const { success, message } = await postRequest(mailUrl, prop);
    if (success) {
      showSuccess(
        setMessage,
        "We have received your email and we will reply you soon."
      );
    } else {
      showError(setMessage, message);
    }
  };
  return (
    <div className={styles.main}>
      <div className={"top"}>
        <Topper data={data} />
      </div>
      <div className={styles.body}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h1>Write to us</h1>
          <p>We will reply within 48 hours</p>
          <label>Your full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Your Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Your Whatsapp Number</label>
          <input
            type="text"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
          <label>Subject</label>
          <textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <label>Body</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} />
          <button
            className="action"
            disabled={!email || !tel || !subject || !text}
          >
            Send Message
          </button>
        </form>
      </div>
      {message && <Spinner error={message} />}
    </div>
  );
}
