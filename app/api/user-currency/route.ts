import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ currency: "USD" })
    }

    const { data, error } = await supabase
      .from("users")
      .select("currency")
      .eq("id", user.id)
      .single()

    if (error) {
      console.error("Failed to fetch user currency:", error.message)
      return NextResponse.json({ currency: "USD" })
    }

    return NextResponse.json({ currency: data?.currency || "USD" })
  } catch (error) {
    console.error("Unexpected error getting user currency:", error)
    return NextResponse.json({ currency: "USD" })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { currency } = await request.json()

    if (currency !== "USD" && currency !== "INR") {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("users").upsert({ id: user.id, currency }, { onConflict: "id" })

    if (error) {
      console.error("Failed to save user currency:", error.message)
      return NextResponse.json({ error: "Failed to save currency" }, { status: 500 })
    }

    return NextResponse.json({ currency })
  } catch (error) {
    console.error("Unexpected error saving user currency:", error)
    return NextResponse.json({ error: "Failed to save currency" }, { status: 500 })
  }
}

