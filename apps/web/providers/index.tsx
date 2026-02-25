"use client";
import { ApolloWrapper } from "./apollo-provider";
import { ThemeProvider } from "./ThemeProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <ApolloWrapper>
        {children}
      </ApolloWrapper>
    </ThemeProvider>
  );
};
