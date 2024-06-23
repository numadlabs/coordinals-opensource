"use client";
import React, { use, useContext, useEffect, useState } from "react";
import Image from "next/image";
import ButtonMd from "../ui/buttonMd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import HeaderItem from "../ui/headerItem";
import { RECEIVER_ADDRESS, WALLET_URL } from "@/lib/constants";
import dynamic from "next/dynamic";
import { useConnector } from "anduro-wallet-connector-react";
import { useMutation } from "@tanstack/react-query";
import { loginHandler } from "@/lib/service/postRequest";
import { clearToken, saveToken } from "@/lib/auth";
import { toast } from "sonner";

// import {} from ''

export default function Header() {
  const router = useRouter();
  const { networkState, walletState, connect, disconnect } =
    useContext<any>(useConnector);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const routesData = [
    {
      title: "Create",
      pageUrl: "/create",
    },
  ];

  const handleDisconnectionAction = async () => {
    const result = await disconnect();
    console.log("*******Disconnect Result", result);
  };
  React.useEffect(() => {
    console.log("Connector Network Information", networkState);
    console.log("Connector Wallet Information", walletState);
  }, [walletState, networkState]);

  const { data, status, mutateAsync } = useMutation({
    mutationFn: loginHandler,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {},
  });

  useEffect(() => {
    const connectWalletOnLoad = async () => {
      try {
        // if (window.unisat) {
        //   const accounts = await window.unisat.getAccounts();

        //   const detailsString = window.localStorage.getItem("userProfile");

        //   if (detailsString !== null) {
        //     const detailsJson =
        //       detailsString !== "null" ? JSON.parse(detailsString) : null;
        //     const now = moment();
        //     if (now.isAfter(detailsJson.expiry) || accounts.length == 0) {
        //       handleLogout();
        //       return;
        //     }

        //     setUserProfile(detailsJson.address);

        //     setConnectedAddress(accounts[0]);
        //     setConnected(true);
        //   }
        // }
        if (window) {
          const walletAddress = window.localStorage.getItem("userProfile");
          if (walletAddress) {
            setWalletAddress(walletAddress);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    connectWalletOnLoad();
  }, []);

  const handleLogin = async () => {
    try {
      setIsConnecting(true);
      const response = await connect({
        chainId: 4,
        walletURL: WALLET_URL,
      });
      if (response.status == true) {
        console.log("🚀 ~ handleLogin ~ response:", response);
        console.log(
          "🚀 ~ handleLogin ~ response.result.accountPublicKey:",
          response.result.accountPublicKey,
        );
        // const walletAddress =
        //   response?.result?.result?.accountPublicKey ?? TEST_ADDRESS;
        const walletAddress = response.result.accountPublicKey;

        // const data = await mutateAsync({
        //   walletData: walletAddress,
        // });
        // console.log(
        //   "🚀 ~ file: ConnectWalletButton.tsx:99 ~ sign ~ data:",
        //   data,
        // );
        // if (data.error) {
        //   setIsConnecting(false);
        //   return toast.error(data.error);
        // } else {
        // saveToken(data?.auth);
        window.localStorage.setItem(
          "userProfile",
          JSON.stringify(walletAddress),
        );
        setWalletAddress(walletAddress);

        // queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        setIsConnecting(false);
        toast.success(`Successfully connected`);
        // }
      } else {
        setIsConnecting(false);
        toast.error(`Canceled`);
      }
    } catch (error) {
      toast.error(`Error when connecting wallet`);
      setIsConnecting(false);
      console.log(error);
    }
  };

  const handleLogout = async () => {
    setWalletAddress("");
    await handleDisconnectionAction();
    clearToken();
    window.localStorage.removeItem("userProfile");
    router.push("/");
  };

  return (
    <div className="h-[72px] w-full flex justify-center bg-neutral500 bg-opacity-[50%] mt-5 rounded-3xl">
      <div className="flex flex-row justify-between items-center max-w-[1216px] w-full">
        <div className="flex flex-row justify-between items-center w-full pl-6 pr-4 h-full">
          <Link href={"/"}>
            <Image src={"/Logo.svg"} alt="coordinals" width={222} height={40} />
          </Link>
          <div className="flex flex-row overflow-hidden items-center gap-4">
            <div className="flex flex-row gap-2 text-neutral00">
              {routesData.map((item, index) => (
                <HeaderItem
                  key={index}
                  title={item.title}
                  handleNav={() => router.push(item.pageUrl)}
                />
              ))}
            </div>
            {walletAddress === "" ? (
              <Button
                variant={"outline"}
                size={"lg"}
                onClick={() => handleLogin()}
                disabled={isConnecting}
              >
                {isConnecting ? "Loading..." : "Connect Wallet"}
              </Button>
            ) : (
              <Button
                variant={"outline"}
                size={"lg"}
                onClick={() => handleLogout()}
              >
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
