import { COMPANYNAME } from "@/app/components/js/config";
import styles from "../style.module.scss";
export default function Page() {
  const texts: { title: string; text: string }[] = [
    {
      title: "General Information",
      text: "ABC Virtual Bank provides this disclaimer page to outline the terms and conditions governing the use of our platform. By accessing and using our website, services, or any related materials, you agree to abide by the terms outlined in this disclaimer.",
    },
    {
      title: "Investment Risks",
      text: "Cryptocurrency investments are inherently volatile and speculative. Prices can fluctuate significantly, and past performance is not indicative of future results. ABC Virtual Bank does not provide financial or investment advice, and users are encouraged to conduct their own research and consult with qualified financial advisors before making any investment decisions.",
    },
    {
      title: "Regulatory Compliance",
      text: "The regulatory environment for cryptocurrencies varies by jurisdiction and may change over time. Users are responsible for understanding and complying with the relevant laws and regulations in their respective regions. ABC Virtual Bank does not guarantee compliance with local, national, or international regulations and shall not be held liable for any legal repercussions arising from the use of our services.",
    },
    {
      title: "Security and Responsibility",
      text: "While ABC Virtual Bank implements robust security measures to protect user assets, cryptocurrency transactions are irreversible, and users are responsible for safeguarding their account information, private keys, and login credentials. ABC Virtual Bank shall not be held liable for any loss of funds due to user negligence, phishing attacks, or unauthorized access.",
    },
    {
      title: "Third-Party Links",
      text: "Our website may contain links to third-party websites or resources for informational purposes. ABC Virtual Bank does not endorse or control the content, security, or privacy practices of these external sites. Users are encouraged to exercise caution and discretion when accessing third-party links.",
    },
    {
      title: "Service Availability",
      text: "ABC Virtual Bank strives to maintain the availability and functionality of its services. However, we do not guarantee uninterrupted access, and the platform may experience downtime or technical issues beyond our control. Users acknowledge that they use our services at their own risk.",
    },
    {
      title: "Disclaimer of Liability",
      text: "ABC Virtual Bank, its affiliates, partners, and employees shall not be held liable for any direct or indirect losses, damages, or expenses incurred by users while using our platform. This includes but is not limited to financial losses, data breaches, or disruptions to services.",
    },
    {
      title: "Changes to Disclaimer",
      text: "ABC Virtual Bank reserves the right to update or modify this disclaimer at any time without prior notice. Users are responsible for regularly reviewing this page to stay informed of any changes.",
    },
    {
      title: "",
      text: "By using ABC Virtual Bank's services, you acknowledge that you have read, understood, and accepted the terms and conditions outlined in this disclaimer. Your continued use of our platform signifies your agreement to abide by these terms.",
    },
  ];

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1>Disclaimer: {COMPANYNAME}</h1>
        {texts.map((e, i) => (
          <div key={i}>
            <h3>{e.title}</h3>
            <p>{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
