import { ReactNode } from "react";
import Box from "../Box";
export default function PageLayout({ children }: { children: ReactNode }) {
  return <Box>{children}</Box>;
}
