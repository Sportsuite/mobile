import { gql } from "@apollo/client";

export const UPDATE_USER_LOCATION = gql`
  mutation UpdateUserLocation($model: UserLocationInput!) {
    UpdateUserLocation(model: $model) {
      data {
        country
        state
        city
      }
    }
  }
`;
