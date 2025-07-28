interface TicketOptions {
  numberedSeat: boolean;
  giantScreen: boolean;
  coveredGrandstand: boolean;
  disabledAccess: boolean;
}

interface Ticket {
  id: string;
  price: number;
  title: string;
  total: number;
  sold: number;
  remaining: number;
  isSoldOut: boolean;
  session: Session;
  description: string;
  image: string;
  options: TicketOptions;
}
