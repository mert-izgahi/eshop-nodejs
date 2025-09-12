"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function TableSortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") ?? "");
  const [sortType, setSortType] = useState(searchParams.get("sortType") ?? "");

  const options: { key: string; value: string; label: string }[] = [
    { key: "createdAt", value: "asc", label: "Created At ↑" },
    { key: "createdAt", value: "desc", label: "Created At ↓" },
    { key: "name", value: "asc", label: "Name ↑" },
    { key: "name", value: "desc", label: "Name ↓" },
  ];

  const handleChange = (key: string, value: string) => {
    setSortBy(key);
    setSortType(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", key);
    params.set("sortType", value);
    params.delete("page"); // reset pagination on sort change

    router.push(`?${params.toString()}`);
  };

  return (
    <Select
      onValueChange={(val) => {
        // val format = key:value
        const [key, value] = val.split(":");
        handleChange(key, value);
      }}
      value={sortBy && sortType ? `${sortBy}:${sortType}` : ""}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={`${option.key}-${option.value}`}
            value={`${option.key}:${option.value}`}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default TableSortSelect;
