"use client";

import React, { useEffect } from "react";
import MobileOnlyScreen from "../mobile-only";
import Header from "./header";
import { Bai_Jamjuree } from "next/font/google";

const bai_Jamjuree = Bai_Jamjuree({
  weight: ["400", "700"],
  style: 'normal',
  subsets: ["latin"],
});

import { WALLET_URL } from "@/lib/constants";
// import { ConnectorContext } from "@/components/connector-context";
// import { UseConnectorProvider } from "anduro-wallet-connector";
const Layout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {}, []);
  return (
    <main className={bai_Jamjuree.className}>
      <div className="flex flex-col w-full h-full bg-background min-h-screen items-center pb-[112px]">
        {/* <UseConnectorProvider walletURL={WALLET_URL}> */}
        <div className="w-full max-w-[1216px]">{children}</div>
        {/* </UseConnectorProvider> */}
      </div>
    </main>
  );
};

export default Layout;
