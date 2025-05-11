"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowDown,
  Calendar,
  ChartColumnDecreasing,
  ChevronDown,
  FileText,
  Home,
  Inbox,
  PartyPopper,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const Pages = [
    {
      name: "Home",
      icon: <Home className="w-4 h-4" />,
      href: "/home",
    },
    {
      name: "My tasks",
      icon: <FileText className="w-4 h-4" />,
      href: "/mytasks",
    },
    {
      name: "Inbox",
      icon: <Inbox className="w-4 h-4" />,
      href: "/inbox",
    },
    {
      name: "Calender",
      icon: <Calendar className="w-4 h-4" />,
      href: "/calender",
    },
    {
      name: "Reports & Analysis",
      icon: <ChartColumnDecreasing className="w-4 h-4" />,
      href: "/reports",
    },
  ];

  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white max-w-1/6 p-2 flex flex-col">
      {/* Top: Profile */}
      <div className="flex justify-between items-center border rounded-lg py-1 px-2 hover:cursor-pointer">
        <div className="flex space-x-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Courtney Henry</span>
            <span className="text-xs text-gray-500">Online</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      {/* Middle content: Pages + Projects */}
      <div className="h-[57vh] mt-6">
        {/* Pages */}
        <div className="space-y-1 ml-2">
          {Pages.map((pgx, i) => {
            const isActive = pathname === pgx.href;
            console.log("href", pathname);
            // console.log("active", isActive);

            return (
              <Link
                href={pgx.href}
                key={i}
                // className="flex items-center space-x-4 text-base hover:cursor-pointer hover:bg-purple-50 p-2"
                className={`flex items-center space-x-4 text-base p-2 relative ${
                  isActive
                    ? "bg-purple-50 text-purple-800 font-medium"
                    : "text-gray-700"
                }`}
              >
                {/* Right side vertical line if active */}
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-purple-500 rounded-l" />
                )}
                <span>{pgx.icon}</span>
                <span>{pgx.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t my-3 mx-[-8px]" />

        {/* Projects */}
        <div className="ml-4 text-base space-y-4">
          <div className="flex justify-between items-center pr-3">
            <span className="text-[90%]">My Projects</span>
            <button className="flex items-center bg-purple-50 py-1 text-sm space-x-1 rounded-2xl px-3 text-purple-400 hover:cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
          <div className="flex space-x-3 items-center">
            <div className="w-3.5 h-3.5 bg-purple-900 rounded" />
            <span className="text-sm">Project launch</span>
          </div>
          <div className="flex space-x-3 items-center">
            <div className="w-3.5 h-3.5 bg-blue-900 rounded" />
            <span className="text-sm">Project launch</span>
          </div>
        </div>
      </div>

      {/* Bottom: Settings */}
      <div className="space-y-1.5 ml-2">
        <Link
          href="/settings"
          className="flex items-center space-x-4  text-base hover:cursor-pointer hover:bg-purple-50 p-2"
        >
          <Settings className="w-4 h-4" />
          <span className="text-[90%]">Settings</span>
        </Link>
        <div className="h-[30%] mr-2 bg-gradient-to-r from-purple-400 via-purple-100 to-white p-6 text-purple-900 rounded-2xl text-center space-y-2 flex flex-col shadow-sm">
          <div className="flex space-x-1.5 items-center">
            <span>
              <PartyPopper className="w-4 h-4" />
            </span>
            <span className="font-mono font-semibold">prodify</span>
          </div>
          <div className="text-justify text-sm font-light">
            <p>
              New members will gain access to public Spaces, Docs and Dashboards
            </p>
          </div>
          <button className="bg-white font-semibold text-black rounded-2xl px-4 py-2 w-fit text-xs hover:bg-gray-100 transition">
            Invite people
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
