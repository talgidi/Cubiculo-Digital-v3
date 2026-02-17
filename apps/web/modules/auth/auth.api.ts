import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { name email }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user { name email }
    }
  }
`;

export const GOOGLE_MUTATION = gql`
  mutation GoogleAuth($token: String!, $provider: String!) {
    authSocial(token: $token, provider: $provider) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;
