"use client";

import React, { useState } from "react";
import Banner from "@/components/section/banner";
import Header from "@/components/layout/header";
import Input from "@/components/ui/input";
import TextArea from "@/components/ui/textArea";
import UploadFile from "@/components/section/uploadFile";
import ButtonLg from "@/components/ui/buttonLg";
import { useRouter } from "next/navigation";
import ButtonOutline from "@/components/ui/buttonOutline";
import { tokenData } from "@/types";
import { mintToken } from "@/utils/mint";
import Layout from "@/components/layout/layout";
import {
  ASSETTYPE,
  FEERATE,
  RECEIVER_ADDRESS,
  MOCK_MENOMIC,
} from "@/lib/constants";
import Image from "next/image";
import useFormState from "@/lib/store/useFormStore";
import { toast } from "sonner";
import { useConnector } from "anduro-wallet-connector-react";

const SingleToken = () => {
  const router = useRouter();
  const { signAndSendTransaction, signTransaction, sign } =
    React.useContext<any>(useConnector);

  const {
    ticker,
    setTicker,
    headline,
    setHeadline,
    supply,
    setSupply,
    imageUrl,
    setImageUrl,
    setTxUrl,
    txUrl,
    reset,
  } = useFormState();

  // const [ticker, setTicker] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    console.log("🚀 ~ handleSubmit ~ imageUrl:", imageUrl);
    if (!imageUrl) {
      setIsLoading(false);
      setError("Image not provided.");
      return;
    }

    const opReturnValues = [
      {
        image_url: imageUrl,
      },
    ];

    const data: tokenData = {
      address: RECEIVER_ADDRESS,
      opReturnValues,
      assetType: ASSETTYPE.TOKEN,
      headline,
      ticker,
      supply,
    };

    if (data.ticker.length !== 7) {
      setIsLoading(false);
      setError("Invalid ticker.");
      return;
    }
    try {
      // const res = await sign({ message: "hi" });
      // console.log("🚀 ~ handleSubmit ~ res:", res);
      // Call the mintToken function with the required data
      const transactionResult = await mintToken(data, MOCK_MENOMIC, FEERATE);
      // console.log("hex:", transactionHex);
      // // const responseHex = await mintToken(data, MOCK_MENOMIC, FEERATE);
      // const hex = transactionHex;
      // const transactionResult = await signAndSendTransaction({
      //   hex,
      // });
      // console.log("transaction result:", transactionResult);
      // if (transactionResult.status == false) {
      //   setError(transactionResult.message || "An error occurred"); // Set the error state
      //   toast.error(transactionResult.message || "An error occurred");
      // }

      if (transactionResult && transactionResult.error == false) {
        setError(transactionResult.message || "An error occurred"); // Set the error state
        toast.error(transactionResult.message || "An error occurred");
        setIsLoading(false);
      } else {
        // setResponse(mintResponse);
        setIsLoading(false);
        // setTxUrl(`https://testnet.coordiscan.io/tx/${mintResponse.result}`);
        setStep(1);
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      setError(error.message || "An error occurred"); // Set the error state
      toast.error(error.message || "An error occurred");
      setIsLoading(false);
    }
  };

  const triggerRefresh = () => {
    setStep(0);
    reset();
    router.push("/create/token");
  };

  const stepperData = ["Upload", "Confirm"];

  return (
    <Layout>
      <div className="flex flex-col w-full h-full pb-[148px]">
        <Header />
        <div className="flex flex-col items-center gap-16 z-50">
          <Banner
            title="Create token"
            image={"/background-2.png"}
            setStep={step}
            stepperData={stepperData}
          />
          {step == 0 && (
            <form onSubmit={handleSubmit}>
              <div className="w-[592px] items-start flex flex-col gap-16">
                <div className="flex flex-col w-full gap-8">
                  <p className="text-profileTitle text-neutral50 font-bold">
                    Details
                  </p>
                  <div className="w-full gap-6 flex flex-col">
                    <Input
                      title="Name"
                      text="Collectible name"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                    />
                    <Input
                      title="Ticker"
                      text="Collectible ticker"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value)}
                    />
                    {/* NaN erro */}
                    <Input
                      title="Supply"
                      text="Collectible supply"
                      value={supply}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSupply(value === "" ? 0 : parseInt(value, 10));
                      }}
                      type="number"
                    />
                    <Input
                      title="Token logo image url"
                      text="Collectible logo image"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                </div>
                {/* <div className="flex flex-col gap-8 w-full">
                  <p className="text-profileTitle text-neutral50 font-bold">
                    Token logo (Optional)
                  </p>
                  {imageBase64 ? (
                    <UploadFile image={imageBase64} onDelete={handleDelete} />
                  ) : (
                    <UploadFile
                      text="Accepted file types: WEBP (recommended), JPEG, PNG, SVG, and GIF."
                      handleImageUpload={handleImageUpload}
                    />
                  )}
                </div> */}
                <div className="flex flex-row gap-8 justify-between w-full">
                  <ButtonOutline
                    title="Back"
                    onClick={() => router.push("/")}
                  />
                  <ButtonLg
                    type="submit"
                    isSelected={true}
                    isLoading={isLoading}
                    // disabled={isLoading}
                  >
                    {isLoading ? "...loading" : "Continue"}
                  </ButtonLg>
                </div>
              </div>
              {error && <div className="text-red-500">{error}</div>}
            </form>
          )}
          {step == 1 && (
            <div className="w-[800px] flex flex-col gap-16">
              <div className="w-full flex flex-row items-center gap-8 justify-start">
                <Image
                  src={imageUrl}
                  alt="background"
                  width={0}
                  height={160}
                  sizes="100%"
                  className="w-[280px] h-[280px] object-cover rounded-3xl"
                />
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <p className="text-3xl text-neutral50 font-bold">
                      ${ticker}
                    </p>
                    <p className="text-xl text-neutral100 font-medium">
                      Total supply:{supply}
                    </p>
                  </div>
                  <p className="text-neutral100 text-lg2">
                    <a href={txUrl} target="_blank" className="text-blue-600">
                      {txUrl}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-8">
                <ButtonOutline
                  title="Go home"
                  onClick={() => router.push("/")}
                />
                <ButtonLg
                  type="submit"
                  isSelected={true}
                  isLoading={isLoading}
                  disabled={isLoading}
                  onClick={() => triggerRefresh()}
                  // onClick={() => router.reload()}
                >
                  Create again
                </ButtonLg>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SingleToken;
