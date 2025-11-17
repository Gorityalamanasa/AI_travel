"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface DeleteItineraryButtonProps {
  itineraryId: string
}

export function DeleteItineraryButton({ itineraryId }: DeleteItineraryButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this itinerary? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        console.error("Failed to delete itinerary")
        alert("Failed to delete itinerary. Please try again.")
        return
      }

      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      console.error("Error deleting itinerary:", error)
      alert("An error occurred while deleting the itinerary.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="border-red-200 text-red-600 hover:bg-red-50"
      onClick={handleDelete}
      disabled={isDeleting || isPending}
    >
      {isDeleting || isPending ? "Deleting..." : "Delete"}
    </Button>
  )
}



