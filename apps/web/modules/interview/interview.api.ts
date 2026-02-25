import { gql } from "@apollo/client";

// Para obtener el pool de preguntas aleatorias
export const GET_RANDOM_INTERVIEW = gql`
  query GetRandomInterview {
    randomInterview {
      id
      questions {
        id
        title
        description
        department
        topic
      }
    }
  }
`;

// Para persistir la respuesta en la base de datos
export const SUBMIT_ANSWER = gql`
  mutation SubmitAnswer($content: String!, $questionId: String!) {
    submitAnswer(content: $content, questionId: $questionId) {
      id
      success
    }
  }
`;

export const FINISH_INTERVIEW = gql`
  mutation FinishInterview($lastAnswerContent: String!, $questionId: String!) {
    finishInterview(lastAnswerContent: $lastAnswerContent, questionId: $questionId) {
      id
      success
    }
  }
`;
