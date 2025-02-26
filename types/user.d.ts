export interface User {
  name: string;
  id: string;
  email: string;
  image: string;
  role: "USER" | "ADMIN";
}
