import { gql } from "@apollo/client";

export const NEW_EMERGENCY_CONTACT = gql`
  mutation NewContact($model: ContactInput!) {
    NewContact(model: $model) {
      data {
        id
        name
        image
        email
        phone
        relationship
      }
      message
    }
  }
`;

export const UPDATE_EMERGENCY_CONTACT = gql`
  mutation UpdateContact($updateContactId: ID!, $model: ContactInput!) {
    UpdateContact(id: $updateContactId, model: $model) {
      data {
        id
        name
        image
        email
        phone
        relationship
      }
      message
    }
  }
`;

export const DELETE_EMERGENCY_CONTACT = gql`
  mutation DeleteContact($deleteContactId: ID) {
    DeleteContact(id: $deleteContactId) {
      message
    }
  }
`;
