// @/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  BarChart3,
  Settings,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Import interfaces (assuming these exist in your project)
import { Event, EventStatus } from "@/types/event";
import { User, Role } from "@/types/user";
import Image from "next/image";

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch events and users in parallel
        const [eventsResponse, usersResponse] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/users"),
        ]);

        const eventsData = await eventsResponse.json();
        const usersData = await usersResponse.json();

        if (eventsResponse.status === 200) {
          setEvents(eventsData.data);
        }

        if (usersResponse.status === 200) {
          setUsers(usersData.data);
        }
      } catch {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate dashboard statistics
  const totalUsers = users.length;
  const adminUsers = users.filter((user) => user.role === Role.ADMIN).length;

  const totalEvents = events.length;
  const upcomingEvents = events.filter(
    (event) => event.status === EventStatus.SCHEDULED
  ).length;
  const liveEvents = events.filter(
    (event) => event.status === EventStatus.LIVE
  ).length;

  // Get recent events (last 5)
  const recentEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
    .slice(0, 5);

  // Get recent users (last 5)
  const recentUsers = [...users]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard. Manage your application from here.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">
              {isLoading ? "..." : totalUsers}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xs text-muted-foreground">
              {adminUsers} administrators
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" /> Manage Users
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Events</CardDescription>
            <CardTitle className="text-3xl">
              {isLoading ? "..." : totalEvents}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xs text-muted-foreground">
              {upcomingEvents} upcoming, {liveEvents} live
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/admin/events">
                <Calendar className="mr-2 h-4 w-4" /> Manage Events
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>System Status</CardDescription>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              Operational
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xs text-muted-foreground">
              All systems running normally
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              <BarChart3 className="mr-2 h-4 w-4" /> View Metrics
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Time</CardDescription>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              {new Date().toLocaleTimeString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              <Calendar className="mr-2 h-4 w-4" /> View Calendar
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="col-span-4 md:col-span-1">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Navigate to key sections</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin/events">
                <Calendar className="mr-2 h-4 w-4" /> Events Management
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" /> Users Management
              </Link>
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="mr-2 h-4 w-4" /> Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity Tabs */}
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest events and user registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="events">
              <TabsList className="mb-4">
                <TabsTrigger value="events">Recent Events</TabsTrigger>
                <TabsTrigger value="users">Recent Users</TabsTrigger>
              </TabsList>

              <TabsContent value="events">
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 bg-secondary animate-pulse rounded-md"
                      ></div>
                    ))}
                  </div>
                ) : recentEvents.length > 0 ? (
                  <div className="space-y-2">
                    {recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 bg-secondary rounded-md hover:bg-secondary/75"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{event.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              event.status === EventStatus.SCHEDULED
                                ? "bg-blue-100 text-blue-800"
                                : event.status === EventStatus.LIVE
                                ? "bg-green-100 text-green-800 animate-pulse"
                                : event.status === EventStatus.COMPLETED
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {EventStatus[event.status]}
                          </Badge>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/events?edit=${event.id}`}>
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No events found
                  </div>
                )}
              </TabsContent>

              <TabsContent value="users">
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-100 animate-pulse rounded-md"
                      ></div>
                    ))}
                  </div>
                ) : recentUsers.length > 0 ? (
                  <div className="space-y-2">
                    {recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-secondary rounded-md hover:bg-secondary/75"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <Image
                            className="rounded-xl"
                            src={user.image || ""}
                            alt={user.name || ""}
                            width={42}
                            height={42}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user.name || "Unnamed User"}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              user.role === Role.ADMIN
                                ? "bg-purple-100 text-primary"
                                : "bg-blue-100 text-background"
                            }
                          >
                            {user.role}
                          </Badge>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/users?edit=${user.id}`}>
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No users found
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/events">View All Events</Link>
            </Button>
            <Button variant="outline" size="sm" className="ml-2" asChild>
              <Link href="/admin/users">View All Users</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* System Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>System Notifications</CardTitle>
          <CardDescription>Important alerts and messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">
                  Scheduled Maintenance
                </h4>
                <p className="text-sm text-amber-700">
                  System maintenance scheduled for March 10, 2025 at 02:00 AM
                  UTC. Expected downtime: 30 minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">
                  System Update Completed
                </h4>
                <p className="text-sm text-green-700">
                  The latest system update was successfully deployed on March 1,
                  2025.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Toaster richColors closeButton />
    </div>
  );
};

export default AdminDashboard;
