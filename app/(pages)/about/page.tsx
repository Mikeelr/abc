import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";
import styles from "./styles.module.scss";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { SiSecurityscorecard } from "react-icons/si";
import { TbBrand4Chan } from "react-icons/tb";
import { GiLifeInTheBalance } from "react-icons/gi";
import { BiHappyBeaming } from "react-icons/bi";
import { FaPeopleGroup } from "react-icons/fa6";
import Key from "@/app/components/js/keys/Key";
import { Metadata } from "next";
import { COMPANYNAME } from "@/app/components/js/config";

export const metadata: Metadata = {
  title: `About ${COMPANYNAME}`,
  description: `ABC Virtual Bank stands at the forefront of financial innovation, offering a robust platform that unlocks the potential of cryptocurrency for users around the globe. We are dedicated to transforming the financial landscape by making digital currency accessible, secure, and efficient to use. Our initiatives are driven by the commitment to empower economic independence and advance global access to digital finance, providing comprehensive tools and resources that enable both beginners and experienced investors to thrive in the expanding world of crypto.`,
};

export default function FSSC() {
  const top: TopperType = {
    img: "/assets/office.jpeg",
    text: [
      "ABC Virtual Bank stands at the forefront of financial innovation, offering a robust platform that unlocks the potential of cryptocurrency for users around the globe. We are dedicated to transforming the financial landscape by making digital currency accessible, secure, and efficient to use. Our initiatives are driven by the commitment to empower economic independence and advance global access to digital finance, providing comprehensive tools and resources that enable both beginners and experienced investors to thrive in the expanding world of crypto.",
    ],
    title: "About Us",
  };
  const texts: { title: string; text: string }[] = [
    {
      title: "Understanding Cryptocurrency",
      text: "Cryptocurrency is a revolutionary form of digital currency that uses cryptographic techniques to secure transactions, control the creation of additional units, and verify the transfer of assets. Operating independently of a central bank, these digital assets are powered by blockchain technology—a distributed ledger enforced by a disparate network of computers. This innovation in finance not only democratizes money management by removing centralized control but also introduces levels of transparency and security unmatched by traditional financial systems.",
    },
    {
      title: "The Rise of Crypto in Africa, with a Focus on Nigeria",
      text: "Africa's embrace of cryptocurrency is transforming its financial landscape, with Nigeria at the forefront of this digital revolution. Economic challenges, including fluctuating fiat currency values and high transaction costs associated with traditional banking, have propelled the adoption of cryptocurrencies. They offer an alternative for wealth preservation and increase financial inclusion by providing services to the unbanked and underbanked populations. Nigeria’s youthful and tech-savvy population has been quick to adopt these technologies, seeing them as a pathway to economic empowerment and a means to participate in global commerce without restrictions.",
    },
    {
      title: "Advantages of Cryptocurrency Over Traditional Fiat Currencies",
      text: "Cryptocurrencies offer distinct advantages over traditional fiat currencies. They facilitate faster transactions that can be conducted at any time without the need for banking hours and without the hefty fees typically associated with international transfers. Cryptocurrencies also provide a higher level of privacy for users, as transactions do not require personal information to be disclosed. Furthermore, the finite supply of many cryptocurrencies, like Bitcoin, contrasts sharply with fiat currencies, which can be devalued by governments through inflation. This makes cryptocurrencies an attractive option for protecting assets against inflation, particularly in economically volatile regions.",
    },
  ];

  return (
    <main>
      <Topper data={top} />
      <div className={styles.about}>
        <section>
          <h2>Our Mission</h2>
          <p>{`Our mission at ABC Virtual Bank is to provide a secure, intuitive, and comprehensive platform that democratizes access to cryptocurrency markets. We strive to simplify the complexities of digital finance, making buying, storing, and investing in cryptocurrencies accessible to everyone. Through cutting-edge technology, robust security measures, and dedicated customer support, we are committed to enhancing user experience and trust in digital transactions. Our focus is on educating our users, supporting community development, and pioneering innovative solutions that drive the future of finance.`}</p>

          <div className="links">
            <Link href={"/signup"} className="action">
              Get Started
            </Link>
          </div>
        </section>
        <section>
          <h2>Our Vision</h2>
          <p>{`To revolutionize the financial landscape by leading the global transition to digital currency. At ABC Virtual Bank, we envision a world where financial transactions are instant, transparent, and accessible to everyone, regardless of geographical location or economic status. Our goal is to empower individuals and businesses alike with the tools and knowledge to navigate the digital economy, fostering financial independence and innovation on a global scale.`}</p>
        </section>
        <div className={styles.center}>
          {texts.map((e, i) => (
            <div key={i}>
              <h3>{e.title}</h3>

              <p>{e.text}</p>
            </div>
          ))}
        </div>

        <section>
          <h2>Join Us on Your Crypto Journey</h2>
          <p>{`At ABC Virtual Bank, we streamline the process of investing in cryptocurrencies. We provide a robust platform that not only makes it easy to purchase and trade digital currencies but also offers secure storage solutions to keep your investments safe. Our state-of-the-art security systems ensure that your financial details and digital assets are protected against cyber threats. ABC Virtual Bank also offers educational resources to help both novice and experienced investors understand market trends and make well-informed decisions. By simplifying the complex world of crypto investments, we aim to empower our users to take full control of their financial future.`}</p>
          <div className="links">
            <Link href={"/signup"} className="action">
              Create Account
            </Link>
          </div>
        </section>
      </div>
      <Key />
    </main>
  );
}
