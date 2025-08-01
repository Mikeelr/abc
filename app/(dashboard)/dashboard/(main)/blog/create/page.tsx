import handleProtected from "@/app/components/js/reuseables";

import { CreatePost } from "../DashboardBlog";

export default async function Page() {
  const token = await handleProtected(true);
  return <CreatePost />;
}
