"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPinIcon,
  GlobeIcon,
  UserIcon,
  Clock,
  ArrowLeft,
  ExternalLink,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EventStatus, Event } from "@/types/event";
import Image from "next/image";
import LoadingScreen from "@/components/ui/loading-screen";
import Link from "next/link";
import { useParams } from "next/navigation";
import RegistrationButton from "./_components/registration-button";

const statusColorMap = {
  [EventStatus.SCHEDULED]: "bg-blue-100 text-blue-800",
  [EventStatus.LIVE]: "bg-green-100 text-green-800",
  [EventStatus.COMPLETED]: "bg-gray-100 text-gray-800",
  [EventStatus.CANCELLED]: "bg-red-100 text-red-800",
};

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshData, setRefreshData] = useState<boolean>(false);
  const [registrationCount, setRegistrationCount] = useState<string | null>(
    null
  );

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/events/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Event not found");
        }
        return res.json();
      })
      .then((data) => {
        setEvent(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, [params.id]);

  useEffect(() => {
    fetch(`/api/registrations/event/count/${id}`, {
      cache: "no-cache",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Registration count not found");
        }
        return res.json();
      })
      .then((data) => {
        setRegistrationCount(data.data);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setError(error.message);
      });
  }, [refreshData]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <p className="text-gray-500 mb-6">
          {error || "The requested event could not be found."}
        </p>
        <Link href="/events">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const formattedCreatedDate = format(
    new Date(event.createdAt),
    "MMMM d, yyyy"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/events"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="relative mb-6">
            <div className="h-64 md:h-96 w-full overflow-hidden rounded-xl hover:overflow-visible ">
              {event.imageUrl ? (
                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  width={2000}
                  height={1000}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : event.isOnline &&
                event.streamUrl &&
                event.status === EventStatus.LIVE ? (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Live Stream</h2>
                  <div className="aspect-video h-full bg-gray-100 rounded-lg overflow-hidden z-50 transition-all duration-500 hover:scale-105">
                    <iframe
                      src={`https://${event.streamUrl}`}
                      className="w-full h-full object-contain"
                      allowFullScreen
                      title={`${event.name} live stream`}
                      frameBorder="10"
                      scrolling="no"
                      height="348"
                      width="620"
                    ></iframe>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
            <div className="absolute top-4 right-4">
              <Badge
                className={`${
                  statusColorMap[event.status]
                } px-3 py-1 text-sm font-medium`}
              >
                {event.status}
              </Badge>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{event.name}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarIcon className="h-5 w-5" />
              <span>{format(eventDate, "EEEE, MMMM d, yyyy")}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span>
                {format(eventDate, "h:mm a")}
                {endDate && ` - ${format(endDate, "h:mm a")}`}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              {event.isOnline ? (
                <>
                  <GlobeIcon className="h-5 w-5" />
                  <span>Online Event</span>
                </>
              ) : (
                <>
                  <MapPinIcon className="h-5 w-5" />
                  <span>{event.location}</span>
                </>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">About this event</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line text-gray-700">
                {event.description}
              </p>
            </div>
          </div>

          {event.gameTitles && event.gameTitles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Featured Games</h2>
              <div className="flex flex-wrap gap-2">
                {event.gameTitles.map((game) => (
                  <Badge key={game} variant="secondary">
                    {game}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <h3 className="text-xl font-semibold">Event Details</h3>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Organized by</p>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{event.organizer}</span>
                </div>
              </div>

              {event.isOnline && event.streamUrl && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Stream URL</p>
                  <a
                    href={event.streamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/75 flex items-center gap-1"
                  >
                    <span className="truncate">{event.streamUrl}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-1">Event created</p>
                <p>{formattedCreatedDate}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Last updated</p>
                <p>{format(new Date(event.updatedAt), "MMMM d, yyyy")}</p>
              </div>
            </CardContent>

            <Separator />

            <CardFooter className="pt-6 pb-6">
              {event.status === EventStatus.LIVE &&
              event.isOnline &&
              event.streamUrl ? (
                <Button className="w-full" size="lg" asChild>
                  <a
                    href={event.streamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Stream Now
                  </a>
                </Button>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <Users2 />
                    <h1>{registrationCount} inscriptions</h1>
                  </div>
                  <RegistrationButton
                    event={event}
                    setRefresh={setRefreshData}
                    refresh={refreshData}
                  />
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
