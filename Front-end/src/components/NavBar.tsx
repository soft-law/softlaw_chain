"use client";
import React from "react";
import { TextSpan } from "@/components/TextSpan";
import Link from "next/link";
import { getApi } from "@/utils/getApi";
import { getSigner } from "@/utils/getSigner";

export default function NavBar() {
  const dashboard = "Dashboard".split("");
  const legaltech = "Legal-Tech".split("");
  const licensing = "Licensing".split("");


  const walletConnect = async () => {
    let sdk = await getApi()
    console.log(sdk)

    let signer = await getSigner()
    console.log(signer)
  }

  return (
    <header className="self-stretch flex min-[2000px]:w-[3000px] py-4 min-[2000px]:px-[320px] px-[200px] items-center bg-[#1C1A11] text-white sticky top-0 z-[100] h-[24] w-full border-b border-[#E5E7EB] backdrop:filter[8px]">
      {/* Desktop View - Full Menu  */}
      <div className="flex justify-between items-start w-full min-[2000px]:py-[25px] py-[16px]">
        <Link href={"/"} className="">
          <img
            src="/images/Logo.svg"
            className="shrink-0 min-[2000px]:w-[300px]"
            loading="lazy"
            alt="Logo"
          />
        </Link>

        <div className="flex items-end justify-between space-x-5">
          <Link
            href={"/dashboard"}
            className="text-white font-normal hover:text-[#facc15] min-[2000px]:text-3xl hidden md:flex focus:text-white"
          >
            {dashboard.map((letter, index) => (
              <TextSpan key={index}>
                {letter === " " ? "\u00A0" : letter}
              </TextSpan>
            ))}
          </Link>
          <Link
            href={"/innovation"}
            className="text-white font-normal hover:text-[#facc15] min-[2000px]:text-3xl hidden md:flex focus:text-white"
          >
            {legaltech.map((letter, index) => (
              <TextSpan key={index}>
                {letter === " " ? "\u00A0" : letter}
              </TextSpan>
            ))}
          </Link>
          {/* <Link
            href={"/licensing"}
            className="text-white font-normal hover:text-[#facc15] min-[2000px]:text-3xl hidden md:flex focus:text-white"
          >
            {licensing.map((letter, index) => (
              <TextSpan key={index}>
                {letter === " " ? "\u00A0" : letter}
              </TextSpan>
            ))}
          </Link> */}

          <button onClick={walletConnect}>
            WALLET
          </button>

     
        </div>

      </div>
    </header>
  );
}
