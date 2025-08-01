import styles from "./home.module.scss";
import Ticker from "../components/js/Ticker";
import CoinPriceTicker from "../components/js/curve/Curve";
import Carousel from "../components/js/carousel/Carousel";
import Services from "../components/js/services/Service";
import Ruba from "../components/js/ruba/Ruba";
import Mission from "../components/js/mission/Mission";

export default function Home() {
  return (
    <div className={styles.main}>
      <Carousel />
      <div className={styles.ticker}>
        <Ticker theme="dark" />
      </div>

      <Services />
      <CoinPriceTicker
        id={`${process.env.NEXT_PUBLIC_RUBA_ID}`}
        coinName="ruba"
      />
      <Ruba />
      <Mission />
    </div>
  );
}
