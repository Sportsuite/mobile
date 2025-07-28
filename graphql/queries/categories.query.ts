import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    GetCategories {
      data {
        id
        name
        image
      }
      message
      status
    }
  }
`;
