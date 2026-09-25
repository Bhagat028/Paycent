"use client"

import { usePathname, useRouter } from "next/navigation"
import React from "react"

export const SidebarItem = ({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) => {
    const pathname = usePathname()
    const router = useRouter()
    const isActive = pathname === href

    return (
        <div
            className={`flex items-center p-2 mb-1 rounded-lg cursor-pointer ${isActive ? "bg-purple-50" : "hover:bg-gray-100"}`}
            onClick={() => router.push(href)}
        >
            <div className={`flex items-center font-bold ${isActive ? "text-[#6a51a6]" : "text-slate-500"}`}>
                {icon}
                <span className="ml-3">{title}</span>
            </div>
        </div>
    )
}
