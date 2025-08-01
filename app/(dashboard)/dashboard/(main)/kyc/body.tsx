"use client";
import { useUserContext } from "@/app/components/js/Wrapper";
import Kycs, { Kyc } from "./Kyc";
import { KYCResponseType } from "@/app/components/js/dataTypes";
export default function Body({
  kycs,
  pages,
}: {
  kycs: KYCResponseType[];
  pages: number;
}) {
  const { user } = useUserContext();
  return user?.role == 2 ? <Kycs kycData={kycs} pages={pages} /> : <Kyc />;
}
