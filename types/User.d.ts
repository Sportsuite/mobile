interface User {
  id: string; // Assuming ID is a string, adjust as needed
  name: string;
  email: string;
  phone: string;
  created_at: {
    date: string; // Adjust to `Date` if you parse this later
    time: string; // Adjust to `Date` or `Time` if you parse this later
  };
  currentLocation?: CurrentLocation;
  admin: boolean;
  image?: string; // Optional, as some users may not have an image
  gender: string;
}

interface CurrentLocation {
  id?: string;
  country: string;
  state: string;
  city: string;
}
interface GetUserResponse {
  GetUser: {
    data: User;
    status: string;
    message: string;
  };
}
