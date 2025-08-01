import handleProtected from "@/app/components/js/reuseables";

import { ConvertWallet } from "../Wallet";

export default async function Page() {
  await handleProtected(false);
  return <ConvertWallet />;
}
