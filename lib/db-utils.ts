// lib/db-utils.ts
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { User } from "@/types/user";
import { Session } from "@/types/session";

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
  if (!currentUser || currentUser?.role !== "ADMIN") {
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
  data: Partial<{ name: string; email: string }>
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

export const getEvents = async () => {
  return prisma.event.findMany();
};
