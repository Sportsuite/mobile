import { useContext } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React from "react";
import { AuthContext } from "@/store/context/auth-context";

// production server
const live_url = "https://sportsuite-prod-api.eu-4.evennode.com/";

// development server
const test_url = "https://sportsuite-api.eu-4.evennode.com/";

const httpLink = createHttpLink({
  uri: test_url,
});

export default function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useContext(AuthContext);

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }));

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        AppDate: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
        Event: {
          fields: {
            endDate: {
              merge(existing, incoming) {
                return incoming || existing;
              },
            },
          },
        },
      },
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
