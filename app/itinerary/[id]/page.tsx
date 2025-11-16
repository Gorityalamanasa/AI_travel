import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { ItineraryContent } from "@/components/itinerary-content"
import { ItineraryActions } from "@/components/ui/ItineraryActions"

interface PageProps {
  params: { id: string }
}

export default async function ItineraryPage({ params }: PageProps) {
  // -------------------- SERVER LOGIC --------------------
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) redirect("/auth/login")

  const { data: itinerary, error } = await supabase
    .from("itineraries")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!itinerary) notFound()

  const duration = Math.ceil(
    (new Date(itinerary.end_date).getTime() - new Date(itinerary.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  // -------------------- JSX (Server Component) --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button variant="outline">← Back</Button>
          </Link>

          {/* CLIENT ACTIONS */}
          <ItineraryActions itineraryId={itinerary.id} />
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Your {itinerary.destination} Adventure
        </h1>

        {/* TRIP SUMMARY */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-cyan-600" />
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-medium">{itinerary.destination}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">{duration} days</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Group Size</p>
                  <p className="font-medium">{itinerary.group_size}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-medium">${itinerary.budget}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Travel Dates</p>
              <p className="font-medium">
                {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
              </p>
            </div>

            {itinerary.preferences?.activities && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Activities</p>
                <div className="flex flex-wrap gap-2">
                  {itinerary.preferences.activities.map((activity: string) => (
                    <Badge key={activity} variant="secondary">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CONTENT */}
        <ItineraryContent
          content={itinerary.content}
          destination={itinerary.destination}
          startDate={itinerary.start_date}
          endDate={itinerary.end_date}
          budget={itinerary.budget}
          groupSize={itinerary.group_size}
        />

      </div>
    </div>
  )
}
