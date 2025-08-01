import { handleAuthorization } from "@/app/components/js/reuseables";
import Body from "./body";
export default async function Account() {
  await handleAuthorization();
  return <Body />;
}
