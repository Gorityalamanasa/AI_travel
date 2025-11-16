"use client"

import { Button } from "@/components/ui/button"
import { Share2, Download } from "lucide-react"

interface Props {
  itineraryId: string
}

export function ItineraryActions({ itineraryId }: Props) {
  // -------------------- SHARE ITINERARY --------------------
  const handleShare = async () => {
    if (navigator.share) {
      // Web Share API for mobile/modern browsers
      await navigator.share({
        title: "My Travel Itinerary",
        text: "Check out my travel plan!",
        url: `${window.location.origin}/itinerary/${itineraryId}`,
      })
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/itinerary/${itineraryId}`)
      alert("Link copied to clipboard!")
    }
  }

  // -------------------- EXPORT PDF --------------------
  const handleExportPDF = () => {
    window.open(`/api/export/pdf?itineraryId=${itineraryId}`, "_blank")
  }

  // -------------------- JSX --------------------
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-2" /> Share
      </Button>

      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        <Download className="h-4 w-4 mr-2" /> Export PDF
      </Button>
    </div>
  )
}
