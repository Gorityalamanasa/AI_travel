"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, PieChart, Receipt } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

// Main Budget Display Component
export function BudgetDisplay({
  totalBudget,
  totalSpent,
  remainingBudget,
  spentPercentage,
  categorySpending,
  categories,
}: {
  totalBudget: number
  totalSpent: number
  remainingBudget: number
  spentPercentage: number
  categorySpending: Record<string, number>
  categories: { key: string; label: string; color: string }[]
}) {
  const { currency, formatCurrency } = useCurrency()

  const getBudgetStatus = () => {
    if (spentPercentage >= 100) return { status: "over", color: "text-red-600", icon: TrendingUp }
    if (spentPercentage >= 80) return { status: "warning", color: "text-yellow-600", icon: AlertTriangle }
    return { status: "good", color: "text-green-600", icon: TrendingDown }
  }

  const budgetStatus = getBudgetStatus()
  const StatusIcon = budgetStatus.icon

  return (
    <div>
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Receipt className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${remainingBudget >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                <StatusIcon className={`h-5 w-5 ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className={`text-2xl font-bold ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(Math.abs(remainingBudget))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PieChart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget Used</p>
                <p className={`text-2xl font-bold ${budgetStatus.color}`}>{spentPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>See how your money is being allocated across different expense types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => {
                const spent = categorySpending[category.key] || 0
                const percentage = totalSpent > 0 ? (spent / totalSpent) * 100 : 0
                return (
                  <div key={category.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${category.color}`} />
                        <span className="text-sm font-medium">{category.label}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {formatCurrency(spent)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
