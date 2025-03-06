// @/lib/db-utils.ts
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { Role, User } from "@/types/user";
import { Session } from "@/types/session";
import { Event } from "@/types/event";

export async function getUserSession() {
  return await auth();
}

export async function getCurrentUser(email?: string) {
  if (email) {
    return await getUserByEmail(email);
  }
  const session: Session | null = await getUserSession();
  if (!session || !session.user || !session.user.email) {
    return null;
  }

  return await getUserByEmail(session.user.email);
}

// Check if the session and the user's email exist
export async function isAdmin() {
  const currentUser: User | null | undefined = await getCurrentUser();

  // Check whether the user exists and has the right role
  if (!currentUser || currentUser?.role !== Role.ADMIN) {
    return false;
  }

  return true;
}

// Fetch all users
export async function getAllUsers() {
  return prisma.user.findMany();
}

// Fetch single user by ID
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

// Fetch single user by email
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Create a new user
export async function createUser(name: string, email: string) {
  return prisma.user.create({
    data: { name, email },
  });
}

// Update user by ID
export async function updateUser(
  id: string,
  data: Partial<{ name: string; email: string; role: Role }>
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

// Delete user by ID
export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}

// Get all events
export const getEvents = async () => {
  return prisma.event.findMany();
};

// Get a specific event by ID
export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
  });
}

// Create a new event
export async function createEvent(eventData: Event) {
  return prisma.event.create({
    data: eventData,
  });
}

// Update an existing event
export async function updateEvent(id: string, eventData: any) {
  return prisma.event.update({
    where: { id },
    data: eventData,
  });
}

// Delete an event
export async function deleteEvent(id: string) {
  return prisma.event.delete({
    where: { id },
  });
}

// Get all events
export const getRegistrations = async () => {
  return prisma.registration.findMany();
};

// Get a specific event by ID
export async function getRegistrationById(id: string) {
  return prisma.registration.findUnique({
    where: { id },
  });
}

// Get all the registration for a given user (by its userId)
export async function getUserRegistrations(userId: string) {
  return prisma.registration.findMany({
    where: { userId },
  });
}

// Get all the registrations for a given event (by its eventId)
export async function getEventRegistrations(eventId: string) {
  return prisma.registration.findMany({
    where: { eventId },
  });
}

// Create a new event
export async function createRegistration(registrationData: any) {
  return prisma.registration.create({
    data: registrationData,
  });
}

// Delete an event
export async function deleteRegistration(id: string) {
  return prisma.registration.delete({
    where: { id },
  });
}
