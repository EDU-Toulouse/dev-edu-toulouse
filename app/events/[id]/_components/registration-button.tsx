"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Event, EventStatus } from "@/types/event";
import { User } from "@/types/user";
import { TriangleAlertIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  event: Event;
  setRefresh: (value: boolean) => void;
  refresh: boolean;
};

type Registration = {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
};

const RegistrationButton = ({ event, setRefresh, refresh }: Props) => {
  const { data: session, status } = useSession();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [userRegistration, setUserRegistration] = useState<Registration | null>(
    null
  );
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser && event) {
      checkRegistrationStatus();
    }
  }, [currentUser, event]);

  const fetchCurrentUser = async () => {
    try {
      // Use a client-side API endpoint instead of direct server function
      if (status === "authenticated") {
        const response = await fetch(`/api/users/${session?.user?.id}`);
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  const checkRegistrationStatus = useCallback(async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/registrations/user/${currentUser.id}`);
      if (response.ok) {
        const result = await response.json();
        // Find the registration for this specific event
        const registration = result.data.find(
          (reg: Registration) => reg.eventId === event.id
        );

        if (registration) {
          setIsRegistered(true);
          setUserRegistration(registration);
        } else {
          setIsRegistered(false);
          setUserRegistration(null);
        }
      }
    } catch (error) {
      console.error("Failed to check registration status:", error);
    }
  }, [currentUser, event]);

  const handleOnRegister = async (eventId: string, userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          userId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration added successfully");
        // Refresh registration status to get the new registration ID
        await checkRegistrationStatus();
      } else {
        toast.error(result.message || "Failed to register for event");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred while registering for the event");
    } finally {
      setIsLoading(false);
      setRefresh(!refresh);
    }
  };

  const handleCancelRegistration = async () => {
    if (!userRegistration) {
      toast.error("No registration found to cancel");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/registrations/${userRegistration.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.status === 200) {
        toast.success("Registration cancelled successfully");
        setIsRegistered(false);
        setUserRegistration(null);
      } else {
        toast.error(result.message || "Failed to cancel registration");
      }
    } catch (error) {
      console.error("Cancel registration error:", error);
      toast.error("An error occurred while cancelling registration");
    } finally {
      setIsLoading(false);
      setShowCancelDialog(false);
      setRefresh(!refresh);
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Processing...";

    if (event.status === EventStatus.SCHEDULED) {
      return isRegistered ? "Cancel Registration" : "Register for Event";
    } else if (event.status === EventStatus.COMPLETED) {
      return "Event Completed";
    } else {
      return "Event Cancelled";
    }
  };

  const handleButtonClick = () => {
    if (!currentUser) {
      toast.error("Please log in to register for this event");
      return;
    }

    if (event.status !== EventStatus.SCHEDULED) return;

    if (isRegistered) {
      setShowCancelDialog(true);
    } else {
      handleOnRegister(event.id, currentUser.id);
    }
  };

  return (
    <>
      <Button
        onClick={handleButtonClick}
        className="w-full"
        size="lg"
        variant={
          event.status === EventStatus.SCHEDULED
            ? isRegistered
              ? "destructive"
              : "default"
            : "outline"
        }
        disabled={
          isLoading ||
          event.status === EventStatus.CANCELLED ||
          event.status === EventStatus.COMPLETED ||
          !currentUser
        }
      >
        {getButtonText()}
      </Button>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-1">
                <TriangleAlertIcon className="h-6 w-6 text-orange-500" />
                Cancel Registration
              </div>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your registration for &quot;
              {event.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-around">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isLoading}
            >
              No, Keep My Registration
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelRegistration}
              disabled={isLoading}
            >
              {isLoading ? "Cancelling..." : "Yes, Cancel Registration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegistrationButton;
