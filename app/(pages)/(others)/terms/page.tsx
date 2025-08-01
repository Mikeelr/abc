import styles from "../style.module.scss";
export default function Page() {
  const texts: { title: string; text: string[] }[] = [
    {
      title: "Eligibility",
      text: [
        "You must be of legal age in your jurisdiction to use ABC Virtual Bank. By using our services, you represent and warrant that you have the legal capacity to enter into these Terms.",
      ],
    },
    {
      title: "User Accounts",
      text: [
        "a. To access certain features of ABC Virtual Bank, you may be required to create an account. You agree to provide accurate and complete information during the registration process and to keep your account information up to date.",
        "b. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.",
      ],
    },
    {
      title: "Use of Services",
      text: [
        "a. ABC Virtual Bank provides services related to cryptocurrency trading, storage, mining, and investment. You agree to use these services in compliance with all applicable laws and regulations.",
        "b. You acknowledge that cryptocurrency investments are speculative and carry risks. ABC Virtual Bank does not provide financial advice, and you are solely responsible for your investment decisions.",
      ],
    },
    {
      title: "Privacy",
      text: [
        "Your use of ABC Virtual Bank is subject to our Privacy Policy, which outlines how we collect, use, and protect your personal information. By using our services, you consent to the terms of our Privacy Policy.",
      ],
    },
    {
      title: "Security",
      text: [
        "a. You are responsible for the security of your account, including safeguarding your login credentials and private keys. ABC Virtual Bank is not liable for any losses resulting from unauthorized access or user negligence.",
        "b. We implement security measures to protect user assets, but we do not guarantee the absolute security of our platform.",
      ],
    },
    {
      title: "Termination",
      text: [
        "We reserve the right to suspend or terminate your access to ABC Virtual Bank at our discretion, including for violations of these Terms or suspicious activities.",
      ],
    },
    {
      title: "Intellectual Property",
      text: [
        "All content and materials on ABC Virtual Bank, including but not limited to logos, trademarks, text, graphics, and software, are the property of ABC Virtual Bank and are protected by copyright and intellectual property laws. You may not use, reproduce, or distribute these materials without our written consent.",
      ],
    },
    {
      title: "Changes to Terms",
      text: [
        "We may update or modify these Terms at any time without prior notice. Your continued use of ABC Virtual Bank after such changes signifies your acceptance of the revised Terms.",
      ],
    },
    {
      title: "Limitation of Liability",
      text: [
        "ABC Virtual Bank, its affiliates, partners, and employees shall not be liable for any direct or indirect losses, damages, or expenses incurred by users while using our platform, including financial losses or disruptions to services.",
      ],
    },
    {
      title: "Contact Information",
      text: [
        "If you have questions or concerns regarding these Terms or any aspect of our services, please contact our customer support team for assistance.",
      ],
    },
    {
      title: "",
      text: [
        "These Terms constitute the entire agreement between you and ABC Virtual Bank and supersede any prior agreements or understandings. Your use of ABC Virtual Bank is subject to these Terms, and any additional terms and conditions provided by specific services within our platform.",
      ],
    },
  ];
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1>Terms and Conditions of ABC Virtual Bank</h1>
        <div>
          <p>{`These Terms and Conditions ("Terms") govern your use of the ABC Virtual Bank platform, its website, and related services (collectively referred to as "ABC Virtual Bank," "we," "us," or "our"). By accessing or using our services, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please refrain from using ABC Virtual Bank.`}</p>
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
