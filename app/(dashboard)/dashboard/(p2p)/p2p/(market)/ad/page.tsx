import handleProtected from "@/app/components/js/reuseables";
import { AdsBody } from "../Market";

export default async function Page() {
  await handleProtected(false);
  return <AdsBody />;
}
