"use client"

import { Calendar, Home, Users, FileText, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "My Attendance",
    href: "/attendance",
    icon: Calendar,
  },
  {
    name: "Leave Requests",
    href: "/leaves",
    icon: FileText,
  },
  {
    name: "Team Directory",
    href: "/employees",
    icon: Users,
  },
]

const adminNavigation = [
  {
    name: "Admin Panel",
    href: "/admin",
    icon: LayoutDashboard,
  },
]

interface AppSidebarProps {
  isAdmin?: boolean
}

export function AppSidebar({ isAdmin }: AppSidebarProps) {
  const pathname = usePathname()

  const allNavigation = isAdmin ? [...navigation, ...adminNavigation] : navigation

  return (
    <Sidebar className="glassmorphism">
      <SidebarHeader className="border-b border-slate-200/50 p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-lg">
            <span className="text-xl font-bold text-white">D</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Dayflow
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {allNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                          isActive
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
