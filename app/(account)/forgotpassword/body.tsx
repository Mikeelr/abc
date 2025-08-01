"use client";
import { postRequest, putRequest } from "@/app/components/js/api_client";
import { recoverUrl } from "@/app/components/js/config";
import showError, { showSuccess } from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
export default function Body() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const handle = async () => {
    setError("Please wait...");
    if (password.length > 2) {
      const { success, message } = await putRequest(
        recoverUrl,
        {
          password,
        },
        token || ""
      );
      if (!success) {
        showError(setError, message);
        return;
      }
      showSuccess(setError, "Password changed");
      router.replace("/login");
    }
    if (email.length > 3 && email.includes("@")) {
      const { success, message } = await postRequest(recoverUrl, {
        email,
      });
      if (!success) {
        showError(setError, message);
        return;
      }
      showSuccess(
        setError,
        "Please check your email, including your spam folder for a recovery email"
      );
    }
  };
  return (
    <div>
      <h1>Account Recovery</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handle();
        }}
      >
        {!token && <label>Email</label>}
        {!token && (
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        {token && <label>New Password</label>}
        {token && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <button
          disabled={
            (token == null && email.length < 3) ||
            (token != null && password.length < 3)
          }
        >
          Proceed
        </button>
      </form>
      <div>
        <Link href={"/signup"}>Sign up</Link>
        <Link href={"/login"}>Login</Link>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
}
