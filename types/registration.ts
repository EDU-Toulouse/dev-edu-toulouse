import { Event } from "./event";
import { User } from "./user";

export interface Registration {
  id: string;
  createdAt: string;
  userId: string;
  user: User;
  eventId: string;
  event: Event;
}
