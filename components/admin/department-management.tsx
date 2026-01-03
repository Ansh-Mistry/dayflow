import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Building2, Users } from "lucide-react"

export async function DepartmentManagement() {
  const supabase = await createClient()

  const { data: departments } = await supabase.from("departments").select("*").order("name", { ascending: true })

  // Get employee count for each department
  const departmentStats = await Promise.all(
    (departments || []).map(async (dept) => {
      const { data: employees } = await supabase.from("profiles").select("id").eq("department", dept.name)
      return {
        ...dept,
        employeeCount: employees?.length || 0,
      }
    }),
  )

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Building2 className="h-5 w-5 text-indigo-600" />
          Department Overview
        </CardTitle>
        <CardDescription className="text-slate-600">View and manage organizational departments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departmentStats && departmentStats.length > 0 ? (
            departmentStats.map((dept) => (
              <Card key={dept.id} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{dept.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">{dept.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4" />
                    <span>{dept.employeeCount} employees</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500">No departments found</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
