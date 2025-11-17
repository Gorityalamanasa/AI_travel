"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Currency = "USD" | "INR"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatCurrency: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const CURRENCY_STORAGE_KEY = "travelai_currency"

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD")

  // Load currency from sessionStorage or user preference on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    const stored = sessionStorage.getItem(CURRENCY_STORAGE_KEY)
    if (stored === "USD" || stored === "INR") {
      setCurrencyState(stored)
      return
    }

    const fetchUserCurrency = async () => {
      try {
        const response = await fetch("/api/user-currency", { cache: "no-store" })
        if (response.ok) {
          const data = await response.json()
          if (data?.currency === "USD" || data?.currency === "INR") {
            setCurrencyState(data.currency)
            sessionStorage.setItem(CURRENCY_STORAGE_KEY, data.currency)
          }
        }
      } catch (error) {
        console.error("Failed to load user currency preference:", error)
      }
    }

    fetchUserCurrency()
  }, [])

  // Update currency and save to sessionStorage
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency)
    }
  }

  // Format currency based on current selection
  const formatCurrency = (amount: number): string => {
    if (currency === "USD") {
      return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } else {
      return "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

