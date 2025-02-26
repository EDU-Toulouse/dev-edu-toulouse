export interface User {
  name: string | null;
  id: string | null;
  email: string | null;
  image: string | null;
  role: "USER" | "ADMIN" | null;
}
