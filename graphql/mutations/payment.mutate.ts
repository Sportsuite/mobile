import { gql } from "@apollo/client";

export const INITIATE_PAYMENT = gql`
  mutation NewOrder($model: OrderInput!) {
    NewOrder(model: $model) {
      data {
        id
        transactionId
        referenceId
        total
        currency
        paid
        cancelled
      }
      clientSecret
      customer
      ephemeralKey
      paymentIntentId
    }
  }
`;

export const CANCEL_ORDER_PAYMENT = gql`
  mutation CancelOrderPayment($paymentIntentId: String!, $orderId: ID!) {
    CancelOrderPayment(paymentIntentId: $paymentIntentId, orderId: $orderId)
  }
`;
