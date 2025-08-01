import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { cryptosUrl, transactionsUrl } from "@/app/components/js/config";
import { getRequest } from "@/app/components/js/api_client";
import { CryptoAndWalletResponseType } from "@/app/components/js/dataTypes";

const getData = async (token: string) => {
  const { data: transactions, success } = await getRequest(
    `${transactionsUrl}`,
    token
  );
  const { data: wallets, success: good } = await getRequest(
    `${cryptosUrl}`,
    token
  );

  const ruba = good
    ? wallets.data.find(
        (wallet: CryptoAndWalletResponseType) => wallet.symbol == "ruba"
      )
    : null;
  return {
    transactions: transactions?.data || [],
    wallets: wallets?.data || [],
    ruba: ruba,
    pages: transactions?.pages || 0,
  };
};

export default async function Page(
  props: {
    params: Promise<{}>;
    searchParams: Promise<{ vrcToken: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const token = await handleProtected(false, searchParams.vrcToken);
  const { wallets, ruba, transactions, pages } = await getData(token);
  return (
    <div>
      <Body
        token={token}
        wallets={wallets}
        transactions={transactions}
        ruba={ruba}
        pages={pages}
      />
    </div>
  );
}
