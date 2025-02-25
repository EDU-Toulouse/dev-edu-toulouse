// lib/db-utils.ts
import { prisma } from "@/prisma";

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
