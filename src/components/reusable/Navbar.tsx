'use client'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback } from "../ui/avatar"

export default function Navbar() {
    return (
        <header className="">
            <div className="mx-auto px-4 py-2 flex items-center justify-end">

                {/* Action Button */}
                <Button variant="default" className="bg-[#DAA425] text-white" >Download Data</Button>
                <Avatar className="mx-5 cursor-pointer">
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback className="bg-black text-white p-2 px-2.5">
                        OS
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}