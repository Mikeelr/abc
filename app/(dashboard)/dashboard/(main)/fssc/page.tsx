import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { fsscsUrl } from "@/app/components/js/config";
import { getRequest } from "@/app/components/js/api_client";

const fetchData = async (token: string) => {
  const { data, success } = await getRequest(`${fsscsUrl}?all=true`, token);
  return success && data?.data.length > 0
    ? { fsscs: data.data, pages: data.pages, fssc: data.data[0] }
    : { fsscs: [], pages: 0, fssc: undefined };
};

export default async function Page() {
  const token = await handleProtected(false);
  const { fssc, fsscs, pages } = await fetchData(token);
  return (
    <div>
      <Body fssc={fssc} fsscs={fsscs} pages={pages} />
    </div>
  );
}
