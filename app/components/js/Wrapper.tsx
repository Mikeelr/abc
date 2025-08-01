"use client";
import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  Dispatch,
  Suspense,
} from "react";
import Script from "next/script";
import { UserResponseType } from "./dataTypes";

import { useRouter, useSearchParams } from "next/navigation";

// import Popup from "./popup/Popup";
import { postRequest } from "./api_client";
import { tokenUrl } from "./config";
export interface Props {
  children?: React.ReactNode;
}

export interface UserContextType {
  user: UserResponseType | null;
  referralID: string;
  logout: () => void;
  logIn: (user: UserResponseType) => void;
}
export const UserContext = createContext<UserContextType | null>(null);
export const useUserContext = () => useContext(UserContext) as UserContextType;

function SetRef({
  setRUsername,
}: {
  setRUsername: Dispatch<React.SetStateAction<string>>;
}) {
  const query = useSearchParams();
  const ref = query.get("referralID");
  useEffect(() => {
    setRUsername(() => ref || "");
  }, [ref]);
  return <></>;
}

export default function Wrap({ children }: Props) {
  const [user, setUser] = useState<UserResponseType | null>(null);
  const [rUsername, setRUsername] = useState<string>("");

  const router = useRouter();
  const logout = () => {
    document.cookie = "token=; path=/";
    document.cookie = "token=; path=/dashboard";
    document.cookie = "token=; path=/login";
    document.cookie = "token=; path=/signup";
    setUser(() => null);
    location.reload();
  };

  const logIn = (user: UserResponseType) => {
    const date: Date = new Date();
    const expireDate: number = date.getFullYear() + 2;
    date.setFullYear(expireDate);
    document.cookie = `token=${user.token};Expires=${date}; path=/`;
    document.cookie = `token=${user.token};Expires=${date}; path=/login`;
    document.cookie = `token=${user.token};Expires=${date}; path=/dashboard`;
    document.cookie = `token=${user.token};Expires=${date}; path=/signup`;
    setUser(user);

    router.replace("/dashboard");
  };

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        return;
      }
      try {
        const cookies = document.cookie?.split(";");
        const bearer = cookies?.filter((cookie) => {
          return cookie.includes("token");
        });
        let bearerToken: string | null;
        if (bearer?.length) {
          bearerToken = bearer[0].split("=")[1];
        } else {
          bearerToken = null;
        }

        if (bearerToken) {
          const { data } = await postRequest(
            tokenUrl,
            {
              token: bearerToken,
            },
            bearerToken
          );

          setUser(data);
        }
      } catch (error) {}
    };
    getUser();
  }, [user?.token]);

  return (
    <div>
      <Suspense>
        <SetRef setRUsername={setRUsername} />
      </Suspense>
      <UserContext.Provider
        value={{
          logIn,
          user,

          referralID: rUsername,
          logout,
        }}
      >
        {children}
      </UserContext.Provider>

      {/* <Script type="text/javascript" id={"2ae77b96b4d333"}>
        {`
var _smartsupp = _smartsupp || {};
_smartsupp.key = 'acdb9988fc656d1e1b30d55ff92ae77b96b4d333';
window.smartsupp||(function(d) {
  var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
  s=d.getElementsByTagName('script')[0];c=d.createElement('script');
  c.type='text/javascript';c.charset='utf-8';c.async=true;
  c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
})(document); `}
</Script>*/}
    </div>
  );
}
