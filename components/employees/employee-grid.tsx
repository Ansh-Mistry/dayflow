import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Mail, Phone, Briefcase, Calendar } from "lucide-react"

export async function EmployeeGrid({ searchParams }: { searchParams?: { search?: string; department?: string } }) {
  const supabase = await createClient()

  let query = supabase.from("profiles").select("*").order("full_name", { ascending: true })

  // Apply search filter
  if (searchParams?.search) {
    query = query.or(`full_name.ilike.%${searchParams.search}%,employee_id.ilike.%${searchParams.search}%`)
  }

  // Apply department filter
  if (searchParams?.department && searchParams.department !== "all") {
    query = query.eq("department", searchParams.department)
  }

  const { data: employees } = await query

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
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {employees && employees.length > 0 ? (
        employees.map((employee) => (
          <Card key={employee.id} className="border-slate-200 transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-indigo-100 text-lg font-semibold text-indigo-600">
                    {getInitials(employee.full_name)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="mt-4 text-lg font-semibold text-slate-900">{employee.full_name}</h3>
                <p className="text-sm text-slate-600">{employee.position || "Employee"}</p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {employee.role === "admin" && (
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Admin</Badge>
                  )}
                  {employee.department && (
                    <Badge variant="outline" className="border-slate-300 text-slate-700">
                      {employee.department}
                    </Badge>
                  )}
                </div>

                <div className="mt-6 w-full space-y-3 border-t border-slate-200 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">{employee.employee_id}</span>
                  </div>
                  {employee.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="truncate text-slate-600">{employee.email}</span>
                    </div>
                  )}
                  {employee.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{employee.phone}</span>
                    </div>
                  )}
                  {employee.hire_date && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">Joined {formatDate(employee.hire_date)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full py-12 text-center text-slate-500">No employees found</div>
      )}
    </div>
  )
}
