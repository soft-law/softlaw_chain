"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Motoverse() {
    return (
        <div className="self-stretch flex flex-col  items-start gap-[40px] ">
            <img src="/images/motoimage.svg" alt="motoimage"  loading="lazy" />
            <div className="flex flex-col items-start gap-[16px] self-stretch max-w-[800px] font-Montesarrat min-[2000px]:max-w-full text-[#EFF4F6]">
              <h1 className="self-stretch text-[48px] font-[500] leading-[110%] tracking-[-0.96px] min-[2000px]:tracking-[1px]">
                Motoverse
              </h1>
              <p className="text-[28px] font-[500] uppercase tracking-[-0.56px] leading-[32px] py-[16px] min-[2000px]:text-3xl min-[2000px]:tracking-[1px]">
                {" "}
                NEXT-GEN CAR DEFI & MARKETPLACE: SAFE, LEGAL, SECURE,
                TRANSPARENT.
              </p>
              <p className="text-[#D0DFE4] text-[16px] font-normal leading-[145%] tracking-[0.32px] min-[2000px]:text-2xl w-full min-[2000px]:tracking-[1px]">
                Transforming the way cars are financed, bought and sold by
                leveraging cutting-edge Web3 technology. The platform ensures
                unrivaled security, transparency, and efficiency in every
                transaction, eliminating fraud and fostering trust among users.
              </p>
            </div>
              {/* <Button url="https://www.motoverse.global/" bgColor="bg-[#D0DFE4]" className="bg-[#D0DFE4] rounded-2xl hover:bg-yellow-400 text-[#1C1A11] font-bold min-[2000px]:text-2xl py-2 px-4 transition-colors duration-300 ease-in-out">
              Explore More

              </Button> */}
            <Link
              href={"https://www.motoverse.global/"}
              target="_blank"
              className="bg-[#D0DFE4] rounded-2xl hover:bg-yellow-400 text-[#1C1A11] font-bold min-[2000px]:text-2xl py-2 px-4 transition-colors duration-300 ease-in-out"
            >
              Explore More
            </Link>
          </div>

    )
}

export default Motoverse;