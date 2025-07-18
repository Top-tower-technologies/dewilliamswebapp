"use client";
import React, { useState, useEffect } from "react";
import {
  Mail,
  Home,
  Inbox,
  UserRound,
  Album,
  BedSingle,
  Sparkles,
  DoorOpen,
  Power,
  UserCircle,
  Banknote,
  PenIcon,
  DollarSign,
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
import { Avatar, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Toast from "./reusable/Toast";

export function AppSidebar() {
  const [showToast, setShowToast] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAccountant, setIsAccountant] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRole = localStorage.getItem("UserRole");
      setIsSuperAdmin(userRole === "super_admin" || userRole === "admin");
      setIsAccountant(userRole === "account");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("AuthKey");
    localStorage.removeItem("UserRole");
    setShowToast(true);
    window.location.href = "/";
  };

  const menuItems = [
    {
      groupTitle: "Quick Access",
      content: [
        { title: "HomePage", url: "/dashboard/home", icon: Home },
        { title: "Bookings", url: "/dashboard/bookings", icon: Album },
      ],
    },
    {
      groupTitle: "Management",
      content: [
        { title: "Guests", url: "/dashboard/guests", icon: UserRound },
        { title: "Reservation", url: "/dashboard/reservation", icon: Mail },
        ...(isSuperAdmin
          ? [
            { title: "Employees", url: "/dashboard/employees", icon: UserCircle },
            { title: "Account Officer", url: "/dashboard/account-officer", icon: PenIcon },
          ]
          : []),

        ...(isAccountant
          ? [
            { title: "Account Officer", url: "/dashboard/account-officer", icon: PenIcon },

          ]
          : []),
      ],
    },
    {
      groupTitle: "Services",
      content: [
        { title: "Rooms", url: "/dashboard/rooms", icon: DoorOpen },
        { title: "Apartments", url: "/dashboard/apartments", icon: BedSingle },
        { title: "Spa & Fitness", url: "#", icon: Sparkles },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-5 py-7 flex flex-row items-center justify-center">
        <Avatar>
          {/* <AvatarImage src="https://some-url" alt="User" /> */}
          <AvatarFallback className="bg-black text-white p-2 px-2.5">SA</AvatarFallback>
        </Avatar>
        <h1 className="text-xl ml-3">
          {isSuperAdmin ? "Super Admin" : isAccountant ? "Accountant" : "Front Desk"}
        </h1>

      </SidebarHeader>

      <SidebarContent className="pl-2">
        {menuItems.map((section, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-md mb-2 font-normal">
              {section.groupTitle}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.content.map(({ title, url, icon: Icon }) => (
                  <SidebarMenuItem
                    key={title}
                    className={`mb-2 transition py-1 ${pathname === url
                      ? "bg-[#FDFFE7] text-[#AB8000]"
                      : "sidebar"
                      }`}
                  >
                    <SidebarMenuButton asChild className="sidebar">
                      <Link href={url}>
                        <Icon />
                        <span className="text-[17px] ml-2">{title}</span>
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
          <SidebarMenuButton
            className="logout py-4 text-[#FF646E]"
            onClick={handleLogout}
          >
            <Power />
            <span className="text-[17px] ml-2">Logout</span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>

      {showToast && <Toast message="Successfully Logged Out" />}
    </Sidebar>
  );
}
