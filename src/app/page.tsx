"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
const SORT_OPTIONS = [
  { name: "sort", value: "none" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
] as const;
export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {" "}
      <div className="flex items-baseline justify-between border-b pb-6 pt-24 border-gray-200">
        {" "}
        <h1 className="text-4xl tracking-tight text-gray-900 font-bold">
          {" "}
          High-Quality Cotton Selection{" "}
        </h1>{" "}
        <div className="flex items-center ">
          {" "}
          <DropdownMenu>
            {" "}
            <DropdownMenuTrigger className="group inline-flex text-gray-700 hover:text-gray-900 justify-center font-medium  text-sm">
              {" "}
              Sort{" "}
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />{" "}
            </DropdownMenuTrigger>{" "}
          </DropdownMenu>{" "}
        </div>{" "}
      </div>{" "}
    </main>
  );
}
