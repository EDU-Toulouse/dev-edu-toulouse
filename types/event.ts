export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isOnline: boolean;
  streamUrl: string;
  gameTitles: string[];
  organizer: string;
  imageUrl: string | undefined;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export enum EventStatus {
  SCHEDULED = "SCHEDULED",
  LIVE = "LIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
