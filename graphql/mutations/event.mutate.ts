import { gql } from "@apollo/client";
import { EVENT_FIELDS } from "../queries/event.query";

export const UPDATE_USER_EVENT_SEARCH_HISTORY = gql`
  mutation UpdateEventSearchHistory($event: ID!) {
    UpdateEventSearchHistory(event: $event)
  }
`;

export const CLEAR_USER_SEARCH_HISTORY = gql`
  mutation ClearEventSearchHistory {
    ClearEventSearchHistory {
      data {
        ...EVENT_FIELDS
      }
    }
  }
  ${EVENT_FIELDS}
`;

export const NEW_EVENT_TICKET_CHECKIN = gql`
  mutation NewEventTicketCheckIn(
    $ticket: ID!
    $code: String!
    $deviceName: String!
  ) {
    NewEventTicketCheckIn(ticket: $ticket, code: $code, deviceName: $deviceName)
  }
`;
