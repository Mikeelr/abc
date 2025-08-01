"use client";
import { useEffect } from "react";

export default function Ticker({ theme = "light" }: { theme?: string }) {
  let make = true;

  useEffect(() => {
    if (make) {
      const body = document.querySelector("#contain12")!;
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

      script.type = "text/javascript";
      script.innerHTML = `{
      "symbols": [
        {
          "proName": "FOREXCOM:SPXUSD",
          "title": "S&P 500"
        },
        {
          "proName": "FOREXCOM:NSXUSD",
          "title": "US 100"
        },
        {
          "proName": "FX_IDC:EURUSD",
          "title": "EUR/USD"
        },
        {
          "proName": "BITSTAMP:BTCUSD",
          "title": "Bitcoin"
        },
        {
          "proName": "BITSTAMP:ETHUSD",
          "title": "Ethereum"
        }
      ],
      "showSymbolLogo": true,
      "colorTheme": "${theme}",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    }`;
      body.appendChild(script);
      make = false;
    }
  }, [make]);

  return (
    <div className="tradingview-widget-container" id="contain12">
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}
