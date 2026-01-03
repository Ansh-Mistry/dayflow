import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server"
import { Users } from "lucide-react"

export async function AllEmployeesTable() {
  const supabase = await createClient()

  const { data: employees } = await supabase.from("profiles").select("*").order("full_name", { ascending: true })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Users className="h-5 w-5 text-indigo-600" />
          All Employees
        </CardTitle>
        <CardDescription className="text-slate-600">Complete list of all employees in the organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees && employees.length > 0 ? (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-indigo-100 text-xs font-semibold text-indigo-600">
                            {getInitials(employee.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-slate-900">{employee.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-slate-700">{employee.employee_id}</TableCell>
                    <TableCell className="text-slate-700">{employee.department || "-"}</TableCell>
                    <TableCell className="text-slate-700">{employee.position || "-"}</TableCell>
                    <TableCell className="text-slate-700">{employee.email}</TableCell>
                    <TableCell className="text-slate-700">{employee.phone || "-"}</TableCell>
                    <TableCell className="text-slate-700">{formatDate(employee.hire_date)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          employee.role === "admin"
                            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                        }
                      >
                        {employee.role}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                    No employees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
