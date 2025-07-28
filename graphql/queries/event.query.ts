import { gql } from "@apollo/client";

export const EVENT_FIELDS = gql`
  fragment EVENT_FIELDS on Event {
    id
    title
    images
    stadium
    isPassed
    hasTicket
    isSoldOut
    destinationLocation {
      geoCode {
        latitude
        longitude
      }
    }
    startDate {
      date
      time
      timestamp
    }
    endDate {
      date
      time
      timestamp
    }
    desc
    country {
      id
      name
    }
    state {
      id
      name
    }
    city {
      id
      name
    }
    location {
      lat
      lng
    }
    category {
      id
      image
      name
    }
    published
    totalBooked
    created_at {
      date
      time
      timestamp
    }
    startingPrice {
      id
      title
      price
      total
      sold
      isSoldOut
      event {
        id
      }
    }
    destinationLocation {
      id
      type
      name
      iataCode
      geoCode {
        latitude
        longitude
      }
      address {
        countryName
        cityName
      }
    }
  }
`;

const PAGINATED_EVENT_FIELDS = gql`
  fragment PAGINATED_EVENT_FIELDS on PaginatedEvent {
    docs {
      ...EVENT_FIELDS
    }
    total
    page
    totalDocs
    totalPages
    nextPage
    prevPage
    hasNextPage
    hasPrevPage
    pagingCounter
  }
  ${EVENT_FIELDS}
`;

// Query for trending events
export const GET_TRENDING_EVENTS = gql`
  query GetTrendingEvent {
    GetTrendingEvent {
      data {
        ...EVENT_FIELDS
      }
      status
      message
    }
  }
  ${EVENT_FIELDS}
`;

// Query for upcoming events
export const GET_UPCOMING_EVENTS = gql`
  query GetUpcomingEvents($limit: Int) {
    GetUpcomingEvents(limit: $limit) {
      data {
        ...EVENT_FIELDS
      }
      status
      message
    }
  }
  ${EVENT_FIELDS}
`;

export const NEAR_BY_EVENTS = gql`
  query GetEventsNearYou($lng: String!, $lat: String!) {
    GetEventsNearYou(lng: $lng, lat: $lat) {
      data {
        ...EVENT_FIELDS
      }
      status
      message
    }
  }
  ${EVENT_FIELDS}
`;

// Query for events by category
export const GET_EVENTS_BY_CATEGORY = gql`
  query GetEventsByCategory($category: ID!) {
    GetEventsByCategory(category: $category) {
      data {
        ...PAGINATED_EVENT_FIELDS
      }
    }
  }
  ${PAGINATED_EVENT_FIELDS}
`;

// Query for paginated upcoming events
export const GET_PAGINATED_UPCOMING_EVENTS = gql`
  query GetUpcomingEventsPaginated($page: Int, $limit: Int) {
    GetUpcomingEventsPaginated(page: $page, limit: $limit) {
      data {
        ...PAGINATED_EVENT_FIELDS
      }
    }
  }
  ${PAGINATED_EVENT_FIELDS}
`;

// Query for paginated nearby events
export const GET_PAGINATED_NEARBY_EVENTS = gql`
  query GetPaginatedEventsNearYou(
    $lng: String!
    $lat: String!
    $page: Int
    $limit: Int
  ) {
    GetPaginatedEventsNearYou(
      lng: $lng
      lat: $lat
      page: $page
      limit: $limit
    ) {
      data {
        ...PAGINATED_EVENT_FIELDS
      }
    }
  }
  ${PAGINATED_EVENT_FIELDS}
`;

// Query for searching events
export const SEARCH_EVENTS = gql`
  query SearchEvents($search: String!, $page: Int, $limit: Int) {
    SearchEvents(search: $search, page: $page, limit: $limit) {
      data {
        ...PAGINATED_EVENT_FIELDS
      }
    }
  }
  ${PAGINATED_EVENT_FIELDS}
`;

// Query for user event search history
export const GET_USER_EVENTS_SEARCH_HISTORY = gql`
  query GetEventSearchHistories {
    GetEventSearchHistories {
      data {
        ...EVENT_FIELDS
      }
    }
  }
  ${EVENT_FIELDS}
`;

// Query for event tickets
export const GET_EVENT_TICKETS = gql`
  query GetEventTickets($event: ID!, $session: ID!) {
    GetEventTickets(event: $event, session: $session) {
      data {
        id
        price
        title
        total
        sold
        isSoldOut
        remaining
        session {
          id
          description
          numberOfDays
          title
          days
        }
        description
        image
        options {
          numberedSeat
          giantScreen
          coveredGrandstand
          disabledAccess
        }
      }
    }
  }
`;

export const GET_EVENT_CALENDARS = gql`
  query GetEventCalendars($event: ID!) {
    GetEventCalendars(event: $event) {
      data {
        id
        title
        desc
        datetime {
          date
          time
          timestamp
        }
      }
    }
  }
`;

export const GET_SESSIONS = gql`
  query GetSessions($event: ID) {
    GetSessions(event: $event) {
      data {
        id
        numberOfDays
        title
        totalTicket
      }
    }
  }
`;

export const GET_BOOKED_EVENTS = gql`
  query GetBookedEvents {
    GetBookedEvents {
      data {
        orders {
          totalTicket
          order {
            id
            total
            currency
            created_at {
              date
              time
              timestamp
            }
          }
        }
        event {
          id
          title
          coverImage
          isPassed
          destinationLocation {
            geoCode {
              latitude
              longitude
            }
          }
          category {
            id
            name
          }
          startDate {
            date
            time
            timestamp
          }
          endDate {
            date
            time
            timestamp
          }
          country {
            id
            name
            latitude
            longitude
            code
            region
          }
          city {
            id
            name
            latitude
            longitude
          }
        }
      }
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query GetEvent($getEventId: ID!) {
    GetEvent(id: $getEventId) {
      data {
        ...EVENT_FIELDS
      }
    }
  }
  ${EVENT_FIELDS}
`;

export const GET_TICKETS_ORDERS = gql`
  query GetOrder($getOrderId: ID!) {
    GetOrder(id: $getOrderId) {
      data {
        id
        total
        currency
        event {
          tickets {
            id
            code
            ticket {
              id
              title
              session {
                id
                title
                numberOfDays
                description
                days
              }
              image
              options {
                numberedSeat
                giantScreen
                coveredGrandstand
                disabledAccess
              }
            }
            total
          }
          total
        }
      }
    }
  }
`;

export const GET_ONGOING_EVENTS = gql`
  query GetOnGoingEvents {
    GetOnGoingEvents {
      data {
        id
        title
        startDate {
          date
          timestamp
        }
        endDate {
          date
          timestamp
        }
        totalBooked
        country {
          id
          name
        }
        state {
          id
          name
        }
        city {
          id
          name
        }
      }
    }
  }
`;

export const GET_ADMIN_EVENT_TICKETS = gql`
  query GetAdminEventTickets($event: ID!) {
    GetAdminEventTickets(event: $event) {
      data {
        id
        title
        session {
          id
          description
        }
      }
    }
  }
`;

export const GET_EVENT_TICKET_USERS = gql`
  query GetEventTicketUsers($event: ID!, $tickets: [ID!]!) {
    GetEventTicketUsers(event: $event, tickets: $tickets) {
      data {
        id
        code
        user {
          id
          name
          image
        }
        ticket {
          id
        }
        used {
          status
          datetime {
            time
            date
            timestamp
          }
          device
        }
      }
    }
  }
`;
