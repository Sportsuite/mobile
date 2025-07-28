interface CartItem {
  id: string;
  type: "ticket" | "transportation" | "hotel" | "other";
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}
