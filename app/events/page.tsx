"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, GlobeIcon, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { motion } from "framer-motion";

import { EventStatus, Event } from "@/types/event";
import Image from "next/image";
import LoadingScreen from "@/components/ui/loading-screen";

const variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1,
      bounce: 0.25,
    },
  },
  exit: {
    opacity: 0,
  },
};

const statusColorMap = {
  [EventStatus.SCHEDULED]: "bg-blue-100 text-blue-800",
  [EventStatus.LIVE]: "bg-green-100 text-green-800",
  [EventStatus.COMPLETED]: "bg-gray-100 text-gray-800",
  [EventStatus.CANCELLED]: "bg-red-100 text-red-800",
};

const EventsListPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (events.length === 0) {
    return (
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container mx-auto px-4 py-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">No events found</h2>
        <p className="text-gray-500">Check back later for upcoming events.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </motion.div>
  );
};

const EventCard = ({ event }: { event: Event }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="relative">
        <div className="h-48 w-full overflow-hidden rounded-t-xl">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.name}
              width={2000}
              height={3000}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <Badge
            className={`${
              statusColorMap[event.status]
            } px-3 py-1 text-sm font-medium`}
          >
            {EventStatus[event.status]}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <h2 className="text-xl font-bold line-clamp-2">{event.name}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {format(new Date(event.startDate), "MMM d, yyyy • h:mm a")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          {event.isOnline ? (
            <>
              <GlobeIcon className="h-4 w-4" />
              <span>Online Event</span>
            </>
          ) : (
            <>
              <MapPinIcon className="h-4 w-4" />
              <span className="truncate">{event.location}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <UserIcon className="h-4 w-4" />
          <span>By {event.organizer}</span>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <p className="text-gray-700 line-clamp-3">{event.description}</p>

        {event.gameTitles && event.gameTitles.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {event.gameTitles.slice(0, 3).map((game) => (
                <Badge key={game} variant="secondary" className="text-xs">
                  {game}
                </Badge>
              ))}
              {event.gameTitles.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{event.gameTitles.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="pt-4">
        <Button
          className="w-full"
          variant={event.status === EventStatus.LIVE ? "default" : "outline"}
          disabled={
            event.status === EventStatus.CANCELLED ||
            event.status === EventStatus.COMPLETED
          }
          asChild
        >
          <a href={`/events/${event.id}`}>
            {event.status === EventStatus.LIVE ? "Join Now" : "View Details"}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventsListPage;
