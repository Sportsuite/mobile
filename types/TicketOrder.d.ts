interface Session {
  id: string;
  title: string;
  numberOfDays: number;
  description: string;
  totalTicket: number;
}

interface Ticket {
  id: string;
  title: string;
  session: Session;
  image: string;
  options: TicketOptions;
  remaining: number;
}

interface TicketItem {
  id: string;
  code: string;
  ticket: Ticket;
  total: string;
}

interface Event {
  tickets: TicketItem[];
  total: string;
}

interface OrderData {
  id: string;
  total: string;
  currency: string;
  event: Event;
}
