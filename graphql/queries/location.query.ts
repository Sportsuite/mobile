import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
  query GetCountries {
    GetCountries {
      data {
        id
        name
        code
        region
      }
    }
  }
`;

export const GET_STATES = gql`
  query GetStates($countryId: ID!) {
    GetStates(countryId: $countryId) {
      data {
        id
        name
        code
        countryCode
        latitude
        longitude
      }
    }
  }
`;

export const GET_CITIES = gql`
  query GetCities($stateId: ID!) {
    GetCities(stateId: $stateId) {
      data {
        id
        name
        latitude
        longitude
      }
    }
  }
`;
