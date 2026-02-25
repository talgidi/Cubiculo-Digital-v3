import { gql } from "@apollo/client";

// Ejemplo de query para el SaaS
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    departments {
      id
      name
      description
      progress
      status
      slug
    }
    overallProgress
  }
`;
