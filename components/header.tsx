import React from "react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700 h-16 bg-[#212121]">
      <div className="flex items-center gap-2">
        <span className="text-lg font-medium">ChatGPT</span>
        <Button variant="ghost" size="sm" className="text-gray-400">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>

      <UserButton />
    </div>
  );
};

export default Header;
