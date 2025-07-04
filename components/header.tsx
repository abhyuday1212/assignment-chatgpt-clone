"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

type HeaderProps = {
  onToggle: () => void;
};

const Header = ({ onToggle }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700 h-16 bg-[#212121]">
      <div className="flex items-center gap-2">
        {/* Hamburger only on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-400"
          onClick={onToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-lg font-medium">ChatGPT</span>
      </div>

      <UserButton />
    </div>
  );
};

export default Header;
