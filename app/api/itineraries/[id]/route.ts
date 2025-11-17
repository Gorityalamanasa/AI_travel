import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

interface RouteParams {
  params: { id: string }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const itineraryId = params.id

    // Ensure itinerary belongs to current user
    const { data: itinerary, error: itineraryError } = await supabase
      .from("itineraries")
      .select("id")
      .eq("id", itineraryId)
      .eq("user_id", user.id)
      .single()

    if (itineraryError || !itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 })
    }

    // Delete related expenses first (if any)
    const { error: expensesError } = await supabase.from("expenses").delete().eq("itinerary_id", itineraryId)

    if (expensesError) {
      console.error("Failed to delete expenses:", expensesError.message)
      // continue; not fatal for itinerary deletion
    }

    // Delete the itinerary
    const { error: deleteError } = await supabase.from("itineraries").delete().eq("id", itineraryId)

    if (deleteError) {
      console.error("Failed to delete itinerary:", deleteError.message)
      return NextResponse.json({ error: "Failed to delete itinerary" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error deleting itinerary:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



