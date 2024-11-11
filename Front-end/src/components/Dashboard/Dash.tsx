"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyProducts from "./MyProducts/MyProducts";
import Manage from "./Manage/Manage";
import Activity from "./Activity/Activity";
import IpSearch from "./IPSearch";
import DashboardProvider, { useDashboardContext } from "@/context/dashboard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import MaxWidthWrapper from "../MaxWidhWrapper";



function DashboardContent() {
  
  const { selectedTabDashboard, setSelectedTabDashboard } =
    useDashboardContext();

  const [formData, setFormData] = useState({
    MyProducts: {
      UploadIP: null,
    },
    Manage: {
      CreateLicense: "",
    },
    Activity: {
      Activity: "",
    },
    IPSearch: {
      SearchInput: "",
    },
  });

  const handleFormDataChange = (tab: string, data: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [tab]: data,
    }));
  };

  return (
    <Tabs
      value={selectedTabDashboard}
      onValueChange={setSelectedTabDashboard}
      className="bg-[#1C1A11] pt-[120px] w-full gap-[8px] mx-auto min-[2000px]:w-[3000px] flex items-center justify-center "
    >
      <MaxWidthWrapper >

      <TabsList className="w-full flex items-center self-stretch justify-between bg-[#1C1A11] ">
        <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <TabsTrigger
            value="MyProducts"
            className={`px-4 py-2 space-x-2 min-[2000px]:space-x-4 ring-0 ${
              selectedTabDashboard === "MyProducts"
                ? "bg-yellow-500 text-black"
                : "text-black"
            }`}
          >
            <h1
              className={`min-[2000px]:text-3xl py-[8px] px-[16px] rounded-md ${
                selectedTabDashboard === "MyProducts"
                  ? "text-[#F6E18B] border border-[#F6E18B]  bg-[#373737]"
                  : "border-[#8A8A8A] text-[#fff]"
              } hover:text-[#F6E18B]
                 hover:border-[#F6E18B] hover:bg-[#373737] uppercase`}
            >
              MY PRODUCTS
            </h1>
          </TabsTrigger>
        </div>

        <div className="flex items-center space-x-2">
          <TabsTrigger
            value="Manage"
            className={`px-4 py-2 space-x-2 min-[2000px]:space-x-4 ring-0 ${
              selectedTabDashboard === "Manage"
                ? "bg-yellow-500 text-black"
                : "text-black"
            }`}
          >
            <h1
              className={`min-[2000px]:text-3xl py-[8px] px-[16px] rounded-md ${
                selectedTabDashboard === "Manage"
                  ? "text-[#F6E18B] border border-[#F6E18B]  bg-[#373737]"
                  : "border-[#8A8A8A] text-[#fff]"
              } hover:text-[#F6E18B]
                 hover:border-[#F6E18B] hover:bg-[#373737] uppercase`}
            >
              Manage
            </h1>
          </TabsTrigger>
        </div>

        <div className="flex items-center space-x-2">
          <TabsTrigger
            value="Activity"
            className={`px-4 py-2 space-x-2 min-[2000px]:space-x-4 ring-0 ${
              selectedTabDashboard === "Activity"
                ? "bg-yellow-500 text-black"
                : "text-black"
            }`}
          >
            <h1
              className={`min-[2000px]:text-3xl py-[8px] px-[16px] rounded-md ${
                selectedTabDashboard === "Activity"
                  ? "text-[#F6E18B] border border-[#F6E18B]  bg-[#373737]"
                  : "border-[#8A8A8A] text-[#fff]"
              } hover:text-[#F6E18B]
                 hover:border-[#F6E18B] hover:bg-[#373737] uppercase`}
            >
              Activity
            </h1>
          </TabsTrigger>
        </div>
        
        </div>
       
        <div className="flex items-center space-x-2">
          <TabsTrigger
            value="IPSearch"
            className={`px-4 py-2 space-x-2 min-[2000px]:space-x-4 ring-0 ${
              selectedTabDashboard === "IPSearch"
                ? "bg-yellow-500 text-black"
                : "text-black"
            }`}
          >
            <h1
              className={`min-[2000px]:text-3xl py-[8px] px-[16px] rounded-md ${
                selectedTabDashboard === "IPSearch"
                  ? "text-[#F6E18B] border border-[#F6E18B]  bg-[#373737]"
                  : "border-[#8A8A8A] text-[#fff]"
              } hover:text-[#F6E18B]
                 hover:border-[#F6E18B] hover:bg-[#373737] uppercase`}
            >
              <span className="flex items-center gap-2">
                <MagnifyingGlassIcon className="min-[2000px]:h-10 min-[2000px]:w-10 h-5 w-5 text-[#B0B0B1]" />
              IPSearch
              </span>
              
            </h1>
          </TabsTrigger>
        </div>
      </TabsList>

      <div className="flex h-screen min-[2000px]:w-[2560px]">
        <TabsContent value="MyProducts">
            
              <MyProducts
              onDataChange={(data) => handleFormDataChange("MyProducts", data)}
              />
        </TabsContent>
        <TabsContent value="Manage">
              <Manage 
               onDataChange={(data) => setFormData({...formData, Manage:data })}
              />
        </TabsContent>
        <TabsContent value="Activity">
            <Activity
            onDataChange={(data) =>
              setFormData({ ...formData, Activity:data})
              }
            />
        </TabsContent>

        <TabsContent value="IPSearch">
            <IpSearch
            onDataChange={(data) =>
              setFormData({ ...formData, IPSearch:data})
              }
            />
        </TabsContent>

      </div>
      </MaxWidthWrapper>
      


    </Tabs>
  );
}

export default function Dash() {
  return (
    <>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </>
  );
}
