interface EveryResponseType {
  _id: string;
  createdAt: string;
}

export interface UserResponseType extends EveryResponseType {
  email: string;
  username: string;
  role: number;
  verified: boolean;
  emailVerified: boolean;
  disabled: boolean;
  token: string;
  sName: string;
  pin: number;
  oNames: string;
  password: string;
  p2pEligible: boolean;
  tel: string;
  referredBy: string;
  companyName: string;
  cryptoCompany: string;
}

export interface InvestmentResponseType extends EveryResponseType {
  username: string;
  amount: number;
  planId: string;
  active: boolean;
  planName: string;
  activeDate: string;
  capitalPaid: boolean;
  interestAvailable: number;
  interestWithdrawn: number;
  interestPaid: number;
  coinName: string;
}
export interface InvestmentPlanResponseType extends EveryResponseType {
  name: string;
  duration: number;
  interest: number;
  minimum: number;
  interestPayment: number;
  maximum: number;
  coinName: string;
  img: string;
  show: boolean;
}

export interface TransactionResponseType extends EveryResponseType {
  username: string;
  amount: number;
  type: number;
  coinName: string;
  status: number;
  internalTran: boolean;
  channel: number;
  receiverWalletAddress: string;
  senderWalletAddress: string;
  network: string;
  transactionId: string;
}

export interface WalletResponseType extends EveryResponseType {
  coinName: string;
  address: string;
  username: string;
  crypto: boolean;
  balance: number;
  adminWallet: boolean;
}
export interface EventResponseType extends EveryResponseType {
  title: string;
  date: number;
  active: boolean;
}
export interface BankInfoResponseType extends EveryResponseType {
  username: string;
  accName: string;
  bankName: string;
  accNo: string;
}
export interface FSSCResponseType extends EveryResponseType {
  username: string;
  country: string;
  state: string;
  dob: string;
  FSSCNo: string;
  img: string;
  status: number;
  individual: boolean;
}
export interface KYCResponseType extends EveryResponseType {
  idNo: string;
  username: string;
  idType: string;
  status: number;
  country: string;
}
export interface ConversionResponseType extends EveryResponseType {
  username: string;
  baseCoin: string;
  newCoin: string;
  amount: number;
  rate: number;
  charge: number;
}
export interface P2PTransactionResponseType extends EveryResponseType {
  sellerUsername: string;
  buyerUsername: string;
  baseCoin: string;
  newCoin: string;
  transactionId: string;
  img: string;
  paid: boolean;
  amount: number;
  type: number;
  rate: number;
  status: number;
  paymentDetails: { accName: string; bankName: string; accNo: string };
}
export interface P2PMarketResponseType extends EveryResponseType {
  username: string;
  baseCoin: string;
  newCoin: string;
  tel: string;
  amount: number;
  rate: number;
  type: number;
  active: boolean;
}
export interface P2PWalletResponseType extends EveryResponseType {
  username: string;
  coins: { coinName: string; balance: number; pending: number }[];
}
export interface P2PWalletType {
  coinName: string;
  balance: number;
  pending: number;
  name: string;
  image: string;
  current_price: number;
}
export interface P2PWalletAndDetailsResponseType extends EveryResponseType {
  username: string;
  coins: P2PWalletType[];
}
export interface P2PCoinsResponseType extends EveryResponseType {
  coinName: string;
  balance: number;
  pending: number;
}
export interface P2PPairResponseType extends EveryResponseType {
  baseCoin: string;
  newCoin: string;
}
export interface CryptoResponseType extends EveryResponseType {
  name: string;
  symbol: string;
  id?: string;
  companyName: string;
  owner: string;
  image: string;
  endPoint?: string;
  current_price: number;
  crypto: boolean;
}
export interface NetworkCoinResponseType extends EveryResponseType {
  market_data: { current_price: { usd: number } };
  name: string;
  symbol: string;
  id?: string;
  companyName?: string;

  endPoint?: string;
  current_price: number;
  crypto: boolean;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
}
export interface CryptoAndWalletResponseType extends CryptoResponseType {
  balance: number;
  username: string;
  address: string;
}
export interface CurrencyResponseType extends EveryResponseType {
  value: number;
  number: string;
}
export interface BenefitResponseType extends EveryResponseType {
  body: string[];
  text: string;
  title: string;
  link: string;
  img: string;
}
export interface BlogResponseType extends EveryResponseType {
  body: string[];
  abstract: string;
  author: string;
  title: string;
  images: { img: string; ref: string }[];
}
export interface APIKeyResponseType extends EveryResponseType {
  username: string;
  coinName: string;
  admin: boolean;
  key: string;
}
export interface NetworkResponseType extends EveryResponseType {
  coinName: string;
  networks: string[];
}

interface EmailAddress {
  address: string;
  username: string;
}
export interface MailSending {
  email_address: EmailAddress;
}
export interface MailPropType {
  emails: MailSending[];
  messageData: string;
  subject: string;
  username: string;
  secret: string;
}

export interface AcceptedCoinType {
  _id: string;
  symbol: string;
  name: string;
  image: string;
  network: string;
  crypto: boolean;
}

export const IDTYPES = [
  "FSSC",
  "DRIVERS LICENSE",
  "BVN",
  "NIN",
  "STATE ID",
  "INTERNATIONAL PASSPORT",
];
export const ACCEPTEDCOINS: AcceptedCoinType[] = [
  {
    _id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    network: "BTCN",
    crypto: true,
    image:
      "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579",
  },
  {
    _id: "ethereum",
    symbol: "eth",
    crypto: true,
    network: "ERC20",
    name: "Ethereum",
    image:
      "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  },
  {
    _id: "tether",
    name: "Tether",
    network: "TRC20",
    symbol: "usdt",
    crypto: false,

    image:
      "https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663",
  },

  {
    _id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    network: "BEP-20",
    crypto: true,

    image:
      "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png?1644979850",
  },

  {
    _id: "solana",
    symbol: "sol",
    crypto: true,
    network: "Solona",
    name: "Solana",
    image:
      "https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422",
  },
  {
    _id: "matic-network",
    symbol: "matic",
    crypto: true,
    network: "Matic polygon",

    name: "Polygon",
    image:
      "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
  },

  {
    _id: "bitcoin-cash",
    symbol: "bch",
    crypto: true,
    network: "BTCN",

    name: "Bitcoin Cash",
    image:
      "https://assets.coingecko.com/coins/images/780/small/bitcoin-cash-circle.png?1594689492",
  },
  {
    _id: "ethereum-classic",
    crypto: true,
    network: "Etherium Classic",
    symbol: "etc",
    name: "Ethereum Classic",
    image:
      "https://assets.coingecko.com/coins/images/453/small/ethereum-classic-logo.png?1547034169",
  },
  {
    _id: "usd-coin",
    symbol: "usdc",
    name: "USD Coin",
    network: "ERC20",
    image:
      "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
    crypto: false,
  },
];
