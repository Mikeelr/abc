import Image from "next/image";
import styles from "./Service.module.scss";
import { IconType } from "react-icons";
import {
  FaHammer,
  FaShieldAlt,
  FaExchangeAlt,
  FaBitcoin,
  FaHandshake,
  FaHeadset,
  FaUsers,
  FaInnosoft,
} from "react-icons/fa";

export default function Services() {
  const services: { title: string; text: string; icon: IconType }[] = [
    {
      title: `Advanced Mining Solutions`,
      text: `Navigating the complexities of cryptocurrency mining is streamlined with ABC Virtual Bank. We offer a diverse range of mining solutions, from entry-level to expert, enabling robust participation in blockchain technology.`,
      icon: FaHammer,
    },
    {
      title: `Fortified Asset Storage`,
      text: `The safeguarding of your digital assets is our top priority. ABC Virtual Bank utilizes the most sophisticated encryption and multi-tier security protocols to ensure the utmost safety of your investments.`,
      icon: FaShieldAlt,
    },
    {
      title: `Sophisticated Trading Platform`,
      text: `ABC Virtual Bank's trading platform is engineered for both newcomers and veteran traders, providing a powerful interface that simplifies the complexities of the cryptocurrency market. Benefit from real-time data and a variety of trading tools designed to empower your investment decisions.`,
      icon: FaExchangeAlt,
    },
    {
      title: `Curated Investment Opportunities`,
      text: `Our expert team at ABC Virtual Bank meticulously selects high-potential cryptocurrencies. Invest with confidence, backed by thorough research and a clear understanding of market dynamics.`,
      icon: FaBitcoin,
    },
    {
      title: `Unwavering Trust and Reliability`,
      text: `At ABC Virtual Bank, we are committed to upholding the highest standards of trust and reliability. Our adherence to strict security measures and transparency ensures your digital assets are managed with the highest degree of integrity.`,
      icon: FaHandshake,
    },
    {
      title: `24/7 Expert Support`,
      text: `Our dedicated support team is always on hand to assist you with any inquiries, provide technical support, or offer guidance on cryptocurrency transactions, ensuring you have support whenever you need it.`,
      icon: FaHeadset,
    },
    {
      title: `Dynamic Community Engagement`,
      text: `Engage with a vibrant community of cryptocurrency advocates through ABC Virtual Bank. Exchange ideas, gain insights, and stay at the forefront of cryptocurrency trends and innovations.`,
      icon: FaUsers,
    },
    {
      title: `Commitment to Innovation`,
      text: `ABC Virtual Bank is at the forefront of integrating technological advancements into our services, continuously enhancing our offerings to better serve the evolving needs of our clients.`,
      icon: FaInnosoft,
    },
  ];
  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <div className={styles.image}>
          <Image src={"/assets/meeting.jpg"} alt="" fill />
        </div>
        <div className={styles.text}>
          <h2>Professional Digital Services for Financial Growth</h2>
          <p>{`At ABC Virtual Bank, we are dedicated to providing a comprehensive suite of cryptocurrency services tailored to empower both novices and experienced enthusiasts.`}</p>
          <p>{`With top-tier security measures and an intuitive interface, ABC Virtual Bank ensures a seamless experience as you explore the potentials of cryptocurrency. `}</p>
        </div>
      </div>
      <div className={styles.services}>
        {services.map((e, i) => (
          <div key={i} className={styles.service}>
            <div className={styles.icon}>
              <e.icon />
            </div>
            <div className={styles.text}>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
