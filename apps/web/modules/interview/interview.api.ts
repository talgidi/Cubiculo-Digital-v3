import { gql } from "@apollo/client";

export const SUBMIT_ANSWER = gql`
  mutation SubmitAnswer($content: String!, $questionId: String!) {
    submitAnswer(content: $content, questionId: $questionId) {
      id
      success
    }
  }
`;
