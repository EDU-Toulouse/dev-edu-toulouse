// @/types/user.ts
import { Role } from "@prisma/client";

export { Role };

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
