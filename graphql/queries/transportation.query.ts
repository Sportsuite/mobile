import { gql } from "@apollo/client";

export const GET_TRANSPORTATION_TYPES = gql`
  query GetTransportationConfigs {
    GetTransportationConfigs {
      data {
        id
        title
        desc
        price
      }
    }
  }
`;
