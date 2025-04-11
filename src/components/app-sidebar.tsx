"use client"
import React from "react";
import {
  Mail,
  Home,
  Inbox,
  UserRound,
  Album,
  BedSingle,
  Sparkles,
  DoorOpen,
  PowerCircle,
  Power,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    groupTitle: "Quick Access",
    content: [
      {
        title: "HomePage",
        url: "/dashboard/home",
        icon: Home,
      },
      {
        title: "Bookings",
        url: "/dashboard/bookings",
        icon: Album,
      },
    ],
  },
  {
    groupTitle: "Management",
    content: [
      {
        title: "Guests",
        url: "/dashboard/guests",
        icon: UserRound,
      },
      {
        title: "Reservtion",
        url: "/dashboard/reservation",
        icon: Mail,
      },
    ],
  },
  {
    groupTitle: "Services",
    content: [
      {
        title: "Rooms",
        url: "/dashboard/rooms",
        icon: DoorOpen,
      },
      {
        title: "Apartments",
        url: "/dashboard/apartments",
        icon: BedSingle,
      },
      {
        title: "Spa & Fitness",
        url: "/dashboard/spa-fitness",
        icon: Sparkles,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar>
      <SidebarHeader className="px-10 py-7 flex items-center flex-row justify-center">
        <Avatar className="">
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback className="bg-black text-white p-2 px-2.5">
            FD
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl ml-3">Front Desk</h1>
        <p></p>
      </SidebarHeader>
      <SidebarContent className="pl-2">
        {items.map((item, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-md mb-2 font-normal">
              {item.groupTitle}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.content.map((subItem) => (
                  <SidebarMenuItem
                    key={subItem.title}
                    className={`mb-2 transition py-1 ${pathname.includes(subItem.url)? "bg-[#FDFFE7] text-[#AB8000]" : "sidebar"}`}
                  >
                    <SidebarMenuButton asChild className="sidebar">
                      <Link href={subItem.url}>
                        <subItem.icon />
                        <span className="text-[17px]">{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="pl-2">
        <SidebarMenu>
          <SidebarMenuButton className="logout py-4 text-[#FF646E]">
            <Power />
            <span className="text-[17px]">Logout</span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
