"use client"
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function TableSearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") ?? "");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams.toString());

        if (search.trim()) {
            params.set("search", search);
        } else {
            params.delete("search"); // remove if empty
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
                name="search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
            >
                Search
            </Button>
        </form>
    );
}

export default TableSearchForm;
