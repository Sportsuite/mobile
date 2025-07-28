interface Category {
  __typename: string; // "Category"
  id: string;
  image: string;
  name: string;
}

interface AppDate {
  __typename?: string; // "AppDate"
  date: string; // e.g., "01/06/2025"
  time: string; // e.g., "11:24:52 AM"
  timestamp: number; // e.g., 1696140000000
}

interface StartingPrice {
  id: string;
  title: string;
  price: string;
  total: number;
  sold: number;
  isSoldOut: boolean;
}

interface EventLocation {
  __typename: string; // "EventLocation"
  lat: number | null;
  lng: number | null;
}

interface EventCalendar {
  id: string;
  title: string;
  desc: string;
  datetime: AppDate;
}

interface GeoCodeObjectInput {
  latitude: number;
  longitude: number;
}

interface FlightAddressInput {
  countryName: string;
  cityName: string;
}

interface DestinationLocation {
  id: string;
  name: string;
  iataCode: string;
  address: FlightAddressInput;
  geoCode: GeoCodeObjectInput;
}

interface CountryLocation {
  id: string;
  name: string;
}

interface EventObj {
  __typename: string; // "Event"
  hasTicket: boolean;
  isSoldOut: boolean;
  category: Category;
  country: CountryLocation;
  state: CountryLocation;
  city: CountryLocation;
  created_at: AppDate;
  desc: string;
  endDate: AppDate;
  id: string;
  stadium: string;
  images: string[];
  location: EventLocation;
  published: boolean;
  startDate: AppDate;
  title: string;
  isPassed: boolean;
  totalBooked: number;
  startingPrice?: StartingPrice;
  destinationLocation?: DestinationLocation;
}
