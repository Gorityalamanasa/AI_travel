import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { AddExpenseForm } from "@/components/add-expense-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BudgetDisplay } from "@/components/budget-display"
import dynamic from "next/dynamic"

const CurrencySelector = dynamic(() => import("@/components/currency-selector").then((mod) => mod.CurrencySelector), {
  ssr: false,
})

interface BudgetPageProps {
  params: { id: string }
}

export default async function BudgetPage({ params }: BudgetPageProps) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect("/auth/login")

  const { data: itinerary, error: itineraryError } = await supabase
    .from("itineraries")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()
  if (itineraryError || !itinerary) notFound()

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("itinerary_id", params.id)
    .order("date", { ascending: false })

  const totalBudget = itinerary.budget || 0
  const totalSpent = expenses?.reduce((sum, e) => sum + Number.parseFloat(e.amount), 0) || 0
  const remainingBudget = totalBudget - totalSpent
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const categorySpending =
    expenses?.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number.parseFloat(e.amount)
      return acc
    }, {} as Record<string, number>) || {}

  const categories = [
    { key: "accommodation", label: "Accommodation", color: "bg-blue-500" },
    { key: "food", label: "Food & Dining", color: "bg-green-500" },
    { key: "transportation", label: "Transportation", color: "bg-yellow-500" },
    { key: "activities", label: "Activities", color: "bg-purple-500" },
    { key: "shopping", label: "Shopping", color: "bg-pink-500" },
    { key: "miscellaneous", label: "Miscellaneous", color: "bg-gray-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/itinerary/${params.id}`}>
            <button className="btn btn-outline flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Itinerary
            </button>
          </Link>
          <div className="flex items-center gap-4">
            <CurrencySelector showLabel={false} />
            <AddExpenseForm itineraryId={params.id} />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget Manager</h1>
        <p className="text-xl text-gray-600">{itinerary.destination} • Track your spending and stay on budget</p>

        {/* Client Component */}
        <BudgetDisplay
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          remainingBudget={remainingBudget}
          spentPercentage={spentPercentage}
          categorySpending={categorySpending}
          categories={categories}
        />
      </div>
    </div>
  )
}
