"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AllEmployeesTable } from "@/components/admin/all-employees-table"
import { AllAttendanceTable } from "@/components/admin/all-attendance-table"
import { AllLeavesTable } from "@/components/admin/all-leaves-table"
import { DepartmentManagement } from "@/components/admin/department-management"

export function AdminTabs() {
  return (
    <Tabs defaultValue="employees" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-white">
        <TabsTrigger value="employees">Employees</TabsTrigger>
        <TabsTrigger value="attendance">Attendance</TabsTrigger>
        <TabsTrigger value="leaves">Leaves</TabsTrigger>
        <TabsTrigger value="departments">Departments</TabsTrigger>
      </TabsList>
      <TabsContent value="employees">
        <AllEmployeesTable />
      </TabsContent>
      <TabsContent value="attendance">
        <AllAttendanceTable />
      </TabsContent>
      <TabsContent value="leaves">
        <AllLeavesTable />
      </TabsContent>
      <TabsContent value="departments">
        <DepartmentManagement />
      </TabsContent>
    </Tabs>
  )
}
