"use client";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { QueryResult } from "@upstash/vector";
import { Product } from "@/db";
import ProductCard from "@/components/products/product";
const SORT_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
] as const;
export default function Home() {
  const [filter, setFilter] = useState({ sort: "none" });
  // console.log(filter);
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<Product>[]>(
        "http://localhost:3000/api/products",
        {
          filter: filter.sort,
        }
      );
      return data;
    },
  });
  console.log(products);
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b pb-6 pt-24 border-gray-200">
        <h1 className="text-4xl tracking-tight text-gray-900 font-bold">
          High-Quality Cotton Selection
        </h1>
        <div className="flex items-center ">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex text-gray-700 hover:text-gray-900 justify-center font-medium  text-sm">
              Sort
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-white shadow-lg p-1 rounded-md"
            >
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.name}
                  className={cn("text-sm block w-full px-4 py-2 text-left", {
                    "text-gray-900 bg-gray-100": filter.sort === option.value,
                    "text-gray-500": filter.sort !== option.value,
                  })}
                  onClick={() => {
                    setFilter((prev) => ({ ...prev, sort: option.value }));
                  }}
                >
                  {option.name}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          {/* Filters */}
          <div></div>
          {/*Products*/}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products?.map((product) => (
              <ProductCard product={product.metadata!} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
