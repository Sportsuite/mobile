import { gql } from "@apollo/client";

export const USER_FIELDS = gql`
  fragment USER_FIELDS on User {
    id
    name
    email
    phone
    currentLocation {
      id
      country
      state
      city
    }
    admin
    image
    gender
  }
`;

// Query for getting user details
export const GET_USER = gql`
  query GetUser {
    GetUser {
      data {
        ...USER_FIELDS
      }
      status
      message
    }
  }
  ${USER_FIELDS}
`;
