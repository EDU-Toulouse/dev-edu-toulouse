"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { User } from "@/types/user";
import { format } from "date-fns";
import LoadingScreen from "@/components/ui/loading-screen";

import { motion } from "framer-motion";

function Profile() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    // Only fetch when authenticated
    if (status === "authenticated" && session?.user) {
      // Fetch user data from an API route
      fetch(`/api/users/${(session.user as User).id}`)
        .then((res) => res.json())
        .then((data) => setUserData(data.data));
    }
  }, [session, status]);

  if (status === "unauthenticated") return redirect("/login");
  if (status === "loading" || !userData) return <LoadingScreen />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", duration: 1, bounce: 0.45 }}
      className="container mx-auto py-8 px-4 pt-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar with user info */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={userData.image || ""}
                  alt={userData.name || ""}
                />
                <AvatarFallback>
                  {userData.name!.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{userData.name}</CardTitle>
            <CardDescription>{userData.email}</CardDescription>
            <div className="flex items-center justify-center">
              <Badge
                variant={userData.role === "ADMIN" ? "destructive" : "default"}
                className="mt-2 w-fit"
              >
                {userData.role}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex justify-center gap-2">
            <Button variant="default" onClick={() => signOut()}>
              Log Out
            </Button>
          </CardFooter>
        </Card>

        {/* Main content area */}
        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    View and manage your personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">User ID</div>
                    <div className="col-span-2 text-muted-foreground">
                      {userData.id}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Name</div>
                    <div className="col-span-2 text-muted-foreground">
                      {userData.name}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Email</div>
                    <div className="col-span-2 text-muted-foreground">
                      {userData.email}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Role</div>
                    <div className="col-span-2 text-muted-foreground">
                      {userData.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notifications" />
                      <span>Receive email notifications</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent actions and updates.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-medium">Profile Updated</h3>
                      <p className="text-sm text-muted-foreground">
                        You updated your profile information
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(
                          new Date(userData?.createdAt),
                          "MMM d, yyyy • h:mm a"
                        )}
                      </p>
                    </div>
                    <div className="pb-4">
                      <h3 className="font-medium">Account Created</h3>
                      <p className="text-sm text-muted-foreground">
                        You created your profile
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(
                          new Date(userData?.updatedAt),
                          "MMM d, yyyy • h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;
