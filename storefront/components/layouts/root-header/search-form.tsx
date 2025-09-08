import * as React from "react";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
export default function SearchForm() {
  return (
    <form className="flex items-center relative w-full max-w-md">
      <SearchIcon className="w-4 text-muted-foreground absolute top-1/2 left-2 transform -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search..."
        className={cn(
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full pl-8  min-w-0 rounded-sm border bg-transparent pr-3 py-1 text-base shadow-none transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        )}
      />
    </form>
  );
}
