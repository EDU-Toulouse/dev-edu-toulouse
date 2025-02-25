export interface User {
  name: string;
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}
