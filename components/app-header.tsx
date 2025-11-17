"use client"

import { CurrencySelector } from "@/components/currency-selector"
import { Globe } from "lucide-react"
import Link from "next/link"

export function AppHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">TravelAI</h1>
          </Link>
          <div className="flex items-center gap-4">
            <CurrencySelector showLabel={false} />
          </div>
        </div>
      </div>
    </header>
  )
}


