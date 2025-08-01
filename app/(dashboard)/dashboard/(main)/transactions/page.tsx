import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { getRequest } from "@/app/components/js/api_client";
import { transactionsUrl } from "@/app/components/js/config";
const getData = async (token: string) => {
  const { data: transactions, success } = await getRequest(
    `${transactionsUrl}`,
    token
  );

  return {
    transactions: transactions.data || [],

    pages: transactions.pages,
  };
};

export default async function Page() {
  const token = await handleProtected(false);
  const { transactions, pages } = await getData(token);
  return (
    <div>
      <Body transactionz={transactions} pages={pages} />
    </div>
  );
}
