// @/app/admin/events/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Calendar,
  MapPin,
  Globe,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Import your Event interface
import { Event, EventStatus } from "@/types/event";
import Image from "next/image";
import { Registration } from "@/types/registration";

const statusColorMap = {
  [EventStatus.SCHEDULED]: "bg-blue-100 text-blue-800",
  [EventStatus.LIVE]: "bg-green-100 text-green-800",
  [EventStatus.COMPLETED]: "bg-gray-100 text-gray-800",
  [EventStatus.CANCELLED]: "bg-red-100 text-red-800",
};

const EventsAdminPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    isOnline: false,
    streamUrl: "",
    gameTitles: [],
    organizer: "",
    status: EventStatus.SCHEDULED,
  });
  const [gameInput, setGameInput] = useState("");

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/events");
      const result = await response.json();

      if (result.status === 200) {
        setEvents(result.data);
      } else {
        toast.error("Error fetching events");
      }
    } catch {
      toast.error("Failed to fetch events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  const [showRegistrationsDialog, setShowRegistrationsDialog] = useState(false);

  const fetchRegistrations = async (eventId: string) => {
    setIsLoadingRegistrations(true);
    try {
      const response = await fetch(`/api/registrations/event/${eventId}`);
      const result = await response.json();

      if (result.status === 200) {
        // Fetch user data for each registration
        const registrationsWithUserData = await Promise.all(
          result.data.map(async (registration: Registration) => {
            const userResponse = await fetch(
              `/api/users/${registration.userId}`
            );
            const userData = await userResponse.json();

            return {
              ...registration,
              user: userData.status === 200 ? userData.data : null,
            };
          })
        );

        setRegistrations(registrationsWithUserData);
        setShowRegistrationsDialog(true);
      } else {
        toast.error("Error fetching event's registrations");
      }
    } catch (error) {
      toast.error("Failed to fetch event's registrations. Please try again.");
    } finally {
      setIsLoadingRegistrations(false);
    }
  };

  const handleDeleteRegistration = async (registrationId: string) => {
    try {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.status === 200) {
        toast.success("Registration removed successfully");
        // Refresh the registrations list
        if (selectedEvent) {
          fetchRegistrations(selectedEvent.id);
        }
      } else {
        toast.error(result.data || "Failed to remove registration");
      }
    } catch (error) {
      toast.error("An error occurred while removing registration");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value as EventStatus });
  };

  const handleAddGame = () => {
    if (gameInput.trim() && !formData.gameTitles?.includes(gameInput.trim())) {
      setFormData({
        ...formData,
        gameTitles: [...(formData.gameTitles || []), gameInput.trim()],
      });
      setGameInput("");
    }
  };

  const handleRemoveGame = (game: string) => {
    setFormData({
      ...formData,
      gameTitles: formData.gameTitles?.filter((g) => g !== game) || [],
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      isOnline: false,
      streamUrl: "",
      gameTitles: [],
      organizer: "",
      status: EventStatus.SCHEDULED,
    });
    setGameInput("");
  };

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      startDate: event.startDate.split("T")[0],
      endDate: event.endDate ? event.endDate.split("T")[0] : "",
      location: event.location,
      isOnline: event.isOnline,
      streamUrl: event.streamUrl,
      gameTitles: event.gameTitles,
      organizer: event.organizer,
      status: event.status,
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setShowDeleteDialog(true);
  };

  const handleCreateEvent = async () => {
    try {
      if (formData.startDate) {
        formData.startDate = new Date(formData.startDate).toISOString();
      }
      if (formData.endDate) {
        formData.endDate = new Date(formData.endDate).toISOString();
      }
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === 201) {
        toast.success("Event created successfully");
        fetchEvents();
        setShowCreateDialog(false);
        resetForm();
      } else {
        toast.error(result.data);
      }
    } catch {
      toast.error("Failed to create event. Please try again.");
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    try {
      if (formData.startDate) {
        formData.startDate = new Date(formData.startDate).toISOString();
      }
      if (formData.endDate) {
        formData.endDate = new Date(formData.endDate).toISOString();
      }
      console.log(JSON.stringify(selectedEvent));
      const response = await fetch(`/api/events/${selectedEvent.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        cache: "no-cache",
      });

      const result = await response.json();

      if (result.status === 200) {
        toast.success("Event updated successfully");
        fetchEvents();
        setShowEditDialog(false);
      } else {
        toast.error(result.data);
      }
    } catch {
      toast.error("Failed to update event. Please try again.");
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.status === 200) {
        toast.success("Event deleted successfully");
        fetchEvents();
        setShowDeleteDialog(false);
      } else {
        toast.error(result.data);
      }
    } catch {
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Event Management</h1>
          <p className="text-muted-foreground">
            Manage your events from this dashboard
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <EventGrid
            events={events}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onViewRegistrations={(event) => {
              setSelectedEvent(event);
              fetchRegistrations(event.id);
            }}
          />
        </TabsContent>
        <TabsContent value="scheduled">
          <EventGrid
            events={events.filter((e) => e.status === EventStatus.SCHEDULED)}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onViewRegistrations={(event) => {
              setSelectedEvent(event);
              fetchRegistrations(event.id);
            }}
          />
        </TabsContent>
        <TabsContent value="live">
          <EventGrid
            events={events.filter((e) => e.status === EventStatus.LIVE)}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onViewRegistrations={(event) => {
              setSelectedEvent(event);
              fetchRegistrations(event.id);
            }}
          />
        </TabsContent>
        <TabsContent value="completed">
          <EventGrid
            events={events.filter((e) => e.status === EventStatus.COMPLETED)}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onViewRegistrations={(event) => {
              setSelectedEvent(event);
              fetchRegistrations(event.id);
            }}
          />
        </TabsContent>
        <TabsContent value="cancelled">
          <EventGrid
            events={events.filter((e) => e.status === EventStatus.CANCELLED)}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onViewRegistrations={(event) => {
              setSelectedEvent(event);
              fetchRegistrations(event.id);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Create Event Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new event.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter event name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer *</Label>
                <Input
                  id="organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="Enter organizer name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your event"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOnline"
                name="isOnline"
                checked={formData.isOnline}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, isOnline: checked })
                }
              />
              <Label htmlFor="isOnline">This is an online event</Label>
            </div>

            {formData.isOnline ? (
              <div className="space-y-2">
                <Label htmlFor="streamUrl">Stream URL</Label>
                <Input
                  id="streamUrl"
                  name="streamUrl"
                  value={formData.streamUrl}
                  onChange={handleInputChange}
                  placeholder="Enter stream URL"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter event location"
                  required={!formData.isOnline}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="status">Event Status</Label>
              <Select
                value={formData.status?.toString()}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EventStatus.SCHEDULED.toString()}>
                    Scheduled
                  </SelectItem>
                  <SelectItem value={EventStatus.LIVE.toString()}>
                    Live
                  </SelectItem>
                  <SelectItem value={EventStatus.COMPLETED.toString()}>
                    Completed
                  </SelectItem>
                  <SelectItem value={EventStatus.CANCELLED.toString()}>
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Game Titles</Label>
              <div className="flex space-x-2">
                <Input
                  value={gameInput}
                  onChange={(e) => setGameInput(e.target.value)}
                  placeholder="Add game title"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGame();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddGame}
                  variant="secondary"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.gameTitles?.map((game) => (
                  <Badge
                    key={game}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {game}
                    <button
                      type="button"
                      onClick={() => handleRemoveGame(game)}
                      className="ml-1 rounded-full hover:bg-gray-200 p-1"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Registrations Dialog */}
      <Dialog
        open={showRegistrationsDialog}
        onOpenChange={setShowRegistrationsDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Event Registrations: {selectedEvent?.name}
            </DialogTitle>
            <DialogDescription>
              View all users registered for this event
            </DialogDescription>
          </DialogHeader>

          {isLoadingRegistrations ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">
                Loading registrations...
              </p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="py-8 text-center">
              <Users2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                No registrations found for this event
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3>
                Number of registration{registrations.length >= 2 ? "s" : ""} :{" "}
                {registrations.length}
              </h3>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-secondary/80">
                  <thead className="bg-secondary/80">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-text-foreground uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-text-foreground uppercase tracking-wider"
                      >
                        Registered On
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-text-foreground uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-secondary/95 divide-y divide-secondary/80">
                    {registrations.map((registration) => (
                      <tr key={registration.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {registration.user?.image ? (
                              <div className="h-10 w-10 flex-shrink-0">
                                <Image
                                  className="h-10 w-10 rounded-xl"
                                  src={registration.user.image}
                                  alt=""
                                  width={40}
                                  height={40}
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Users2 className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-foreground">
                                {registration.user?.name || "Unknown"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground/50">
                            {registration.user?.email || "No email"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/50">
                          {format(
                            new Date(registration.createdAt),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className="flex items-center justify-center"
                                variant="ghost"
                                size="sm"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() =>
                                  handleDeleteRegistration(registration.id)
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Remove
                                Registration
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRegistrationsDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the details of this event.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Event Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter event name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-organizer">Organizer *</Label>
                <Input
                  id="edit-organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="Enter organizer name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your event"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date *</Label>
                <Input
                  id="edit-startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isOnline"
                name="isOnline"
                checked={formData.isOnline}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, isOnline: checked })
                }
              />
              <Label htmlFor="edit-isOnline">This is an online event</Label>
            </div>

            {formData.isOnline ? (
              <div className="space-y-2">
                <Label htmlFor="edit-streamUrl">Stream URL</Label>
                <Input
                  id="edit-streamUrl"
                  name="streamUrl"
                  value={formData.streamUrl}
                  onChange={handleInputChange}
                  placeholder="Enter stream URL"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location *</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter event location"
                  required={!formData.isOnline}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-status">Event Status</Label>
              <Select
                value={formData.status?.toString()}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EventStatus.SCHEDULED.toString()}>
                    Scheduled
                  </SelectItem>
                  <SelectItem value={EventStatus.LIVE.toString()}>
                    Live
                  </SelectItem>
                  <SelectItem value={EventStatus.COMPLETED.toString()}>
                    Completed
                  </SelectItem>
                  <SelectItem value={EventStatus.CANCELLED.toString()}>
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Game Titles</Label>
              <div className="flex space-x-2">
                <Input
                  value={gameInput}
                  onChange={(e) => setGameInput(e.target.value)}
                  placeholder="Add game title"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGame();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddGame}
                  variant="secondary"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.gameTitles?.map((game) => (
                  <Badge
                    key={game}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {game}
                    <button
                      type="button"
                      onClick={() => handleRemoveGame(game)}
                      className="ml-1 rounded-full hover:bg-primary p-1"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEvent}>Update Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the event &quot;
              {selectedEvent?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEvent}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster richColors closeButton />
    </div>
  );
};

// Event Grid Component
const EventGrid = ({
  events,
  isLoading,
  onEdit,
  onDelete,
  onViewRegistrations,
}: {
  events: Event[];
  isLoading: boolean;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onViewRegistrations: (event: Event) => void;
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-[300px] animate-pulse">
            <div className="h-40 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="pt-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found</p>
      </div>
    );
  }

  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card
          key={event.id}
          className="overflow-hidden hover:shadow-md transition-all duration-500 hover:scale-105"
        >
          <div className="relative h-40 bg-gray-100">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.name}
                width={2000}
                height={3000}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Calendar className="h-12 w-12" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge className={`${statusColorMap[event.status]} px-2 py-1`}>
                {EventStatus[event.status]}
              </Badge>
            </div>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="line-clamp-1">{event.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(event.startDate), "MMM d, yyyy")}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-2">
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {event.description}
            </p>
            <div className="flex items-center text-xs text-gray-500 mb-1">
              {event.isOnline ? (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  <span>Online Event</span>
                </>
              ) : (
                <>
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">{event.location}</span>
                </>
              )}
            </div>

            {event.gameTitles && event.gameTitles.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {event.gameTitles.slice(0, 2).map((game) => (
                  <Badge
                    key={game}
                    variant="outline"
                    className="text-xs px-1.5 py-0"
                  >
                    {game}
                  </Badge>
                ))}
                {event.gameTitles.length > 2 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    +{event.gameTitles.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-0 flex justify-between">
            <div className="flex justify-center items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => onEdit(event)}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewRegistrations(event)}
              >
                <Users2 className="h-4 w-4 mr-1" /> Registrations
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(event)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDelete(event)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default EventsAdminPage;
