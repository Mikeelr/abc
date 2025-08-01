import Body from "./body";
import fetchData from "./getdata";

export default async function Page(props: { params: Promise<{ title: string }> }) {
  const params = await props.params;
  const title = params.title || "";
  const data = await fetchData(title);

  return <Body post={data} />;
}
