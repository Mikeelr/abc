import { ReactNode } from "react";
import P2PBox from "../P2PBox";
export default function PageLayout({ children }: { children: ReactNode }) {
  return <P2PBox>{children}</P2PBox>;
}
