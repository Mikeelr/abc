import React, { useEffect } from "react";
import styles from "./Tradeview.module.scss";

const Tradeview = () => {
  let make = true;
  useEffect(() => {
    if (make) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
      script.innerHTML = `
         {"colorTheme": "dark",
  "dateRange": "12M",
  "exchange": "US",
  "showChart": true,
  "locale": "en",
  "largeChartUrl": "",
  "isTransparent": true,
  "showSymbolLogo": false,
  "showFloatingTooltip": true,
  "width": "100%",
  "height": "100%",
  "plotLineColorGrowing": "rgba(20, 63, 108, 1)",
  "plotLineColorFalling": "rgba(41, 98, 255, 1)",
  "gridLineColor": "rgba(240, 243, 250, 0)",
  "scaleFontColor": "rgba(106, 109, 120, 1)",
  "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
  "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
  "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
  "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
  "symbolActiveColor": "rgba(41, 98, 255, 0.12)"}`;
      document.querySelector("#container")!.appendChild(script);
      make = false;
    }
  }, [make]);
  return (
    <div className={styles.view} id="container">
      <div className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
};

export default Tradeview;
