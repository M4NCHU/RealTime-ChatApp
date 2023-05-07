import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { getSession } from "next-auth/react";

// endpoint graphql
const httpLink = new HttpLink({
    // Miejsce wysyłania zapytań
    uri: "http://localhost:4000/graphql",
    credentials: "include",
})

// websocket

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: "ws://localhost:4000/graphql/subscriptions",
          connectionParams: async () => ({
            session: await getSession(),
          }),
        })
      )
    : null;



  const link = typeof window !== "undefined" && wsLink !== null ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
) : httpLink

  

// eksportowanie instancji klasy ApolloClient
export const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
})