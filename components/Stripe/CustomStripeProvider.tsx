import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLISHABLE_KEY, STRIPE_PROD_KEY } from "@env";

export default function CustomStripeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <>{children}</>
    </StripeProvider>
  );
}
