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
import ProductSkeleton from "@/components/products/ProductSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductState } from "@/lib/validators/product-validator";
const SORT_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
] as const;

const COLOR_FILTERS = {
  id: "color",
  name: "Color",
  options: [
    { value: "white", label: "White" },
    { value: "beige", label: "Beige" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
  ] as const,
};
const SIZE_FILTERS = {
  id: "size",
  name: "Size",
  options: [
    { value: "S", label: "S" },
    { value: "L", label: "L" },
    { value: "M", label: "M" },
  ] as const,
};

const PRICE_FILTERS = {
  id: "price",
  name: "price",
  options: [
    { value: [0, 100], label: "any price" },
    {
      value: [0, 20],
      label: "Under 20€",
    },
    {
      value: [0, 40],
      label: "Under 40€",
    },
    //custom value created via jsx
  ] as const,
};

const SUBCATEGORIES = [
  { name: "T-Shirts", selected: true, href: "#" },
  { name: "Hoodies", selected: false, href: "#" },
  { name: "Sweatshirts", selected: false, href: "#" },
  { name: "Accessories", selected: false, href: "#" },
];

const DEFAULT_RANGE = [0, 100] as [number, number];
export default function Home() {
  const [filter, setFilter] = useState<ProductState>({
    color: ["beige", "green", "purple", "white", "blue"],
    size: ["S", "M", "L"],
    sort: "none",
    price: { isCustom: false, range: DEFAULT_RANGE },
  });
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
  // console.log(products);
  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, "price" | "sort">;
    value: string;
  }) => {
    const isFilterApplied = filter[category].includes(value as never);
    if (isFilterApplied) {
      setFilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
    }
  };
  console.log(filter);
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
          <div className="hidden lg:block">
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              {SUBCATEGORIES.map((category) => (
                <li key={category.name}>
                  <button
                    disabled={!category.selected}
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
            <Accordion type="multiple" className="animate-none">
              <AccordionItem value="color">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Color</span>
                </AccordionTrigger>
                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4">
                    {COLOR_FILTERS.options.map((option, idx) => (
                      <li
                        key={option.value}
                        className="flex gap-2 items-center"
                      >
                        <input
                          id={`color-${idx}`}
                          type="checkbox"
                          onChange={() =>
                            applyArrayFilter({
                              category: "color",
                              value: option.value,
                            })
                          }
                          checked={filter.color.includes(option.value)}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`color-${idx}`}>{option.label}</label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="size">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Size</span>
                </AccordionTrigger>
                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4">
                    {SIZE_FILTERS.options.map((option, idx) => (
                      <li
                        key={option.value}
                        className="flex gap-2 items-center"
                      >
                        <input
                          id={`size-${idx}`}
                          type="checkbox"
                          onChange={() =>
                            applyArrayFilter({
                              category: "size",
                              value: option.value,
                            })
                          }
                          checked={filter.size.includes(option.value)}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`size-${idx}`}>{option.label}</label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="price">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Price</span>
                </AccordionTrigger>
                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4">
                    {PRICE_FILTERS.options.map((option, idx) => (
                      <li
                        key={option.label}
                        className="flex gap-2 items-center"
                      >
                        <input
                          id={`price-${idx}`}
                          type="radio"
                          onChange={() =>
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...option.value],
                              },
                            }))
                          }
                          checked={
                            !filter.price.isCustom &&
                            filter.price.range[0] === option.value[0] &&
                            filter.price.range[1] === option.value[1]
                          }
                          className="w-4 h-4"
                        />
                        <label htmlFor={`price-${idx}`}>{option.label}</label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          {/*Products grid*/}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products
              ? products.map((product) => (
                  <ProductCard
                    key={product.metadata?.id}
                    product={product.metadata!}
                  />
                ))
              : Array(12)
                  .fill(null)
                  .map((_, i) => <ProductSkeleton key={i} />)}
          </ul>
        </div>
      </section>
    </main>
  );
}
