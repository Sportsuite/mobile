interface User {
  id: string;
  name: string;
  image: string | null;
}

interface UsedStatus {
  status: boolean;
  datetime: AppDate;
  device: string | null;
}

interface EventTicketUser {
  id: string;
  code: string;
  user: User;
  used: UsedStatus;
  ticket: Ticket;
}
