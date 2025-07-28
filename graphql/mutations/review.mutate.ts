import { gql } from "@apollo/client";

export const NEW_REVIEW = gql`
  mutation NewReviewRating($model: ReviewRatingInput!) {
    NewReviewRating(model: $model) {
      data {
        id
        comment
        rating
        created_at {
          timestamp
          time
          date
        }
      }
      message
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReviewRating($deleteReviewRatingId: ID) {
    DeleteReviewRating(id: $deleteReviewRatingId) {
      data {
        id
      }
      message
    }
  }
`;
