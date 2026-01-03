import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EmployeesLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="mt-4 h-6 w-32" />
              <Skeleton className="mt-2 h-4 w-24" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="mt-6 w-full space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
