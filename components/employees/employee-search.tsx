"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

export function EmployeeSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    startTransition(() => {
      router.push(`/employees?${params.toString()}`)
    })
  }

  const handleDepartmentFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set("department", value)
    } else {
      params.delete("department")
    }
    startTransition(() => {
      router.push(`/employees?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search employees by name or ID..."
          className="border-slate-300 pl-10"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <Select defaultValue={searchParams.get("department") || "all"} onValueChange={handleDepartmentFilter}>
        <SelectTrigger className="w-full border-slate-300 sm:w-64">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          <SelectItem value="Engineering">Engineering</SelectItem>
          <SelectItem value="Human Resources">Human Resources</SelectItem>
          <SelectItem value="Sales">Sales</SelectItem>
          <SelectItem value="Marketing">Marketing</SelectItem>
          <SelectItem value="Finance">Finance</SelectItem>
          <SelectItem value="Operations">Operations</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
