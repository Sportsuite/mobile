import { gql } from "@apollo/client";
import { USER_FIELDS } from "../queries/user.query";

export const LOGIN_REQUEST = gql`
  mutation LoginRequest($username: String!, $password: String!) {
    LoginRequest(username: $username, password: $password)
  }
`;

export const VERIFY_LOGIN = gql`
  mutation VerifyLogin($username: String!, $token: String!) {
    VerifyLogin(username: $username, token: $token) {
      data {
        ...USER_FIELDS
      }
      token
    }
  }
  ${USER_FIELDS}
`;

export const CREATE_ACCOUNT = gql`
  mutation NewAccount($model: UserInput!) {
    NewAccount(model: $model)
  }
`;

export const RESEND_LOGIN_CODE = gql`
  mutation ResendLoginCode($username: String!) {
    ResendLoginCode(username: $username)
  }
`;

export const PASSWORD_RESET_REQUEST = gql`
  mutation PasswordResetRequest($username: String!) {
    PasswordResetRequest(username: $username)
  }
`;

export const NEW_PASSWORD_RESET = gql`
  mutation NewPasswordReset(
    $username: String!
    $token: String!
    $password: String!
  ) {
    NewPasswordReset(username: $username, token: $token, password: $password) {
      data {
        ...USER_FIELDS
      }
      token
    }
  }
  ${USER_FIELDS}
`;

export const NEW_PASSWORD_CHANGE = gql`
  mutation NewPasswordChange($currentPassword: String!, $password: String!) {
    NewPasswordChange(currentPassword: $currentPassword, password: $password) {
      token
    }
  }
`;

export const UPDATE_PHONE_NUMBER = gql`
  mutation ChangePhoneNumber($mobile: String!) {
    ChangePhoneNumber(mobile: $mobile) {
      data {
        id
        phone
      }
    }
  }
`;

// Steps to change User Email address fucntions starts here
export const REQUEST_EMAIL_CHANGE = gql`
  mutation RequestEmailChange {
    RequestEmailChange {
      data
    }
  }
`;

export const VERIFY_EMAIL_CHANGE = gql`
  mutation VerifyEmailChangeToken($token: String!) {
    VerifyEmailChangeToken(token: $token) {
      data
    }
  }
`;

export const NEW_EMAIL_CHANGE_REQUEST = gql`
  mutation NewEmailChangeRequest($email: String!) {
    NewEmailChangeRequest(email: $email) {
      data
    }
  }
`;

export const VERIFY_NEW_EMAIL_CHANGE_REQUEST = gql`
  mutation VerifyNewEmailChangeToken($token: String!) {
    VerifyNewEmailChangeToken(token: $token) {
      data {
        id
        name
        email
      }
    }
  }
`;

export const RESEND_CHANGE_EMAIL_CODE = gql`
  mutation Mutation {
    ResendEmailChangeCode
  }
`;

export const ACCOUNT_DELETE_REQUEST = gql`
  mutation Mutation {
    AccountDeleteRequest
  }
`;

export const CONFIRM_ACCOUNT_DELETION = gql`
  mutation ConfirmAccountDeleteRequest($token: String!) {
    ConfirmAccountDeleteRequest(token: $token)
  }
`;
// Steps to change User Email address fucntions ends here

export const CHANGE_PROFILE_IMG = gql`
  mutation ChangeProfileImage($imagePath: String!) {
    ChangeProfileImage(imagePath: $imagePath) {
      data
      message
    }
  }
`;
