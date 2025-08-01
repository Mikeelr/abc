import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { putRequest } from "./api_client";
import { tokenUrl, usersUrl } from "./config";

const handleProtected = async (admin: boolean = false, vrcToken?: string) => {
  const nextCookies = await cookies();

  const token = nextCookies.get("token")?.value;

  if (vrcToken) redirect(`/verify_email?vrcToken=${vrcToken}`);
  if (!token) redirect("/login");
  const { data, success } = await putRequest(tokenUrl, { token }, token);
  if (!success) redirect("/login");
  if (admin && data.role != 2) {
    redirect("/dashboard");
  }
  return token;
};
export const handleVerify = async (vrcToken?: string) => {
  if (!vrcToken) redirect("/login");

  const { data, success } = await putRequest(
    `${usersUrl}637`,
    {
      verifyEmail: true,
    },
    vrcToken
  );
  return { success, data };
};
export const handleAuthorization = async () => {
  const nextCookies = await cookies();

  const token = nextCookies.get("token")?.value;

  if (!token) return;
  const { success } = await putRequest(tokenUrl, { token }, token);
  if (success) redirect("/dashboard");
};

export default handleProtected;
