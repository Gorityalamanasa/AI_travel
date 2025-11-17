"use client"

import { useState } from "react"
import { useCurrency } from "@/contexts/currency-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function CurrencySelector({ showLabel = true, className = "" }: { showLabel?: boolean; className?: string }) {
  const { currency, setCurrency } = useCurrency()
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = async (value: "USD" | "INR") => {
    setCurrency(value)

    try {
      setIsSaving(true)
      await fetch("/api/user-currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: value }),
      })
    } catch (error) {
      console.error("Failed to save currency preference:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && <Label className="text-sm font-medium">Currency:</Label>}
      <Select value={currency} onValueChange={(value) => handleChange(value as "USD" | "INR")} disabled={isSaving}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">USD ($)</SelectItem>
          <SelectItem value="INR">INR (₹)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

