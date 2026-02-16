import { useMutation, useApolloClient } from "@apollo/client";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "./auth.api";

export const useAuthActions = () => {
  const router = useRouter();
  const client = useApolloClient();

  const [loginMutation, { loading: loginLoading, error: loginError }] = useMutation(LOGIN_MUTATION);
  const [signupMutation, { loading: signupLoading, error: signupError }] = useMutation(SIGNUP_MUTATION);

  const handleAuthSuccess = (token: string) => {
    // 1. Guardar en localStorage para el Apollo Client (authLink)
    localStorage.setItem("token", token);
    
    // 2. Guardar en COOKIES para el Middleware de Next.js
    // 'expires: 7' mantiene la sesión por 7 días
    Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });

    // 3. Redirigir al DASHBOARD, no al inicio
    router.push("/dashboard");
    router.refresh(); // Forzamos a Next.js a re-validar el Middleware
  };

  const logout = () => {
    // 1. Borrar Cookie para el Middleware
    Cookies.remove('token');
    
    // 2. Borrar LocalStorage para el Apollo Link
    localStorage.removeItem("token");

    // 3. ¡CRÍTICO! Limpiar el caché de Apollo 
    // Esto evita que el siguiente usuario vea datos del anterior en memoria
    client.clearStore();

    // 4. Redirigir y refrescar
    router.push("/login");
    router.refresh();
  };

  return {
    login: async (variables: any) => {
      const { data } = await loginMutation({ variables });
      if (data?.login?.token) handleAuthSuccess(data.login.token);
    },
    signup: async (variables: any) => {
      const { data } = await signupMutation({ variables });
      if (data?.signup?.token) handleAuthSuccess(data.signup.token);
    },
    logout,
    loading: loginLoading || signupLoading,
    error: loginError || signupError,
  };
};
