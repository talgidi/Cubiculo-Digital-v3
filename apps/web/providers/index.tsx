"use client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ApolloWrapper } from "./apollo-provider";
import { ThemeProvider } from "./ThemeProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Validación de seguridad para desarrollo
  if (!googleClientId) {
    console.warn(
      "⚠️ Google Client ID no configurado. El login social no funcionará. " +
      "Añade NEXT_PUBLIC_GOOGLE_CLIENT_ID a tu archivo .env"
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <ThemeProvider>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};
