import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Dayflow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-slate-700">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Modern HR Management
            <br />
            <span className="text-indigo-600">Made Simple</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-600">
            Streamline your workforce management with Dayflow. Track attendance, manage leaves, and monitor employee
            performance all in one place.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </Link>
          </div>

          <div className="mt-24 grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Time Tracking</h3>
              <p className="text-pretty text-sm text-slate-600">
                Easy clock in/out with automatic work hours calculation
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Leave Management</h3>
              <p className="text-pretty text-sm text-slate-600">Request and approve leaves with a simple workflow</p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Employee Directory</h3>
              <p className="text-pretty text-sm text-slate-600">
                Comprehensive employee profiles and contact information
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
