import { EMAIL } from "@/app/components/js/config";
import styles from "../style.module.scss";
export default function Page() {
  const texts: { title: string; text: string[] }[] = [
    {
      title: "Information We Collect",
      text: [
        "a. Personal Information: We may collect personal information such as your name, email address, phone number, and government-issued identification to verify your identity and provide our services.",
        "b. Financial Information: To process transactions, we may collect financial information, including bank account details or cryptocurrency wallet addresses.",
        "c. Device Information: We gather device information, including your IP address, browser type, and operating system, to enhance the security and functionality of our platform.",
        "d. Usage Data: We collect data about your interactions with our services, such as the pages you visit, the actions you take, and the dates and times of these interactions.",
      ],
    },
    {
      title: "How We Use Your Information",
      text: [
        "a. To Provide Services: We use your information to offer and maintain our cryptocurrency trading, storage, mining, and investment services.",
        "b. Security and Fraud Prevention: Your data helps us detect and prevent fraud, unauthorized access, and other security incidents.",
        "c. Customer Support: We may use your information to provide customer support and address inquiries, concerns, or issues.",
        "d. Communication: We may send you important notifications, updates, and promotional materials based on your communication preferences.",
      ],
    },
    {
      title: "Information Sharing",
      text: [
        "a. Service Providers: We may share your information with trusted service providers who assist us in delivering our services, subject to confidentiality agreements.",
        "b. Legal Compliance: We may disclose your data to comply with legal obligations, protect our rights, or respond to legal requests.",
      ],
    },
    {
      title: "Security",
      text: [
        "We employ industry-standard security measures to protect your data from unauthorized access, disclosure, alteration, or destruction. However, please note that no data transmission over the internet is entirely secure.",
      ],
    },
    {
      title: "Cookies and Tracking Technologies",
      text: [
        "We use cookies and similar tracking technologies to enhance your experience on ABC Virtual Bank. You can manage your cookie preferences through your browser settings.",
      ],
    },
    {
      title: "Your Choices",
      text: [
        "a. Account Information: You can access, correct, or update your account information by logging into your ABC Virtual Bank account.",
        "b. Communication Preferences: You can choose to receive or opt out of certain communications from us.",
      ],
    },
    {
      title: "Children's Privacy",
      text: [
        "ABC Virtual Bank does not knowingly collect or maintain information from individuals under the age of 18. If you believe that we have inadvertently collected data from a child, please contact us, and we will take appropriate steps to delete the information.",
      ],
    },
    {
      title: "Changes to this Privacy Policy",
      text: [
        "We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting an updated Privacy Policy on our website.",
      ],
    },
    {
      title: "Contact Information",
      text: [
        `If you have questions, concerns, or requests related to your privacy or this Privacy Policy, please contact us directly ${EMAIL}`,
        "By using ABC Virtual Bank, you acknowledge that you have read, understood, and consented to this Privacy Policy.",
      ],
    },
  ];
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1>Privacy Policy of ABC Virtual Bank</h1>
        <h2>Last Updated: August 2023</h2>
        <div>
          <p>{`At ABC Virtual Bank, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, share, and safeguard your data when you use our website, services, or interact with us in any way. By using ABC Virtual Bank, you consent to the practices described in this Privacy Policy.`}</p>
        </div>
        {texts.map((e, i) => (
          <div key={i}>
            <h3>{e.title}</h3>
            {e.text.map((k, j) => (
              <p key={j}>{k}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
