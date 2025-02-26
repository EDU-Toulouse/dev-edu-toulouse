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
  imageUrl: string?;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

enum EventStatus {
  "SCHEDULED",
  "LIVE",
  "COMPLETED",
  "CANCELLED",
}
