import { gql } from "@apollo/client";

export const GET_EMERGENCY_CONTACTS = gql`
  query Data {
    GetContacts {
      data {
        id
        name
        image
        email
        phone
        relationship
      }
    }
  }
`;
