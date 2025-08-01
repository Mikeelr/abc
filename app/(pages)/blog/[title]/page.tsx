import Body from "./body";
import fetchData from "./getdata";

export default async function Page({ params }: { params: { title: string } }) {
  const title = params.title || "";
  const data = await fetchData(title);

  return <Body post={data} />;
}
