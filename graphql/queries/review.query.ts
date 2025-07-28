import { gql } from "@apollo/client";

export const GET_REVIEW = gql`
  query GetReview($order: ID!) {
    GetReview(order: $order) {
      data {
        id
        comment
        rating
        created_at {
          date
          time
          timestamp
        }
      }
    }
  }
`;
