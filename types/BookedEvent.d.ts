interface Event {
  id: string;
  title: string;
  coverImage: string;
  category: Category;
  startDate: AppDate;
  endDate: AppDate;
  country: Country;
  city: City;
  isPassed: boolean;
  destinationLocation: DestinationLocation;
}

interface OrderDetails {
  totalTicket: string;
  order: Order;
}
interface Order {
  id: string;
  total: string;
  currency: string;
  created_at: AppDate;
}

interface BookedEvent {
  orders: OrderDetails[];
  event: Event;
}
