"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DownloadItineraryButtonProps {
  destination: string
  startDate: string
  endDate: string
  groupSize: number
  budget: number
  activities?: string[]
  content: string
}

export function DownloadItineraryButton({
  destination,
  startDate,
  endDate,
  groupSize,
  budget,
  activities,
  content,
}: DownloadItineraryButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })

  const handleDownload = () => {
    setIsDownloading(true)

    try {
      const header = `TravelAI Itinerary
Destination: ${destination}
Travel Dates: ${formatDate(startDate)} - ${formatDate(endDate)}
Group Size: ${groupSize} ${groupSize === 1 ? "person" : "people"}
Total Budget: $${budget.toLocaleString()}
Selected Activities: ${activities && activities.length > 0 ? activities.join(", ") : "Not specified"}

============================================
`

      const fileContents = `${header}${content}`
      const blob = new Blob([fileContents], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)

      const safeDestination = destination?.toLowerCase().replace(/\s+/g, "-") || "itinerary"
      const link = document.createElement("a")
      link.href = url
      link.download = `${safeDestination}-itinerary.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download itinerary:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
      <Download className="h-4 w-4 mr-2" />
      {isDownloading ? "Preparing..." : "Download Itinerary"}
    </Button>
  )
}


