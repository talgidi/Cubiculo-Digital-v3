import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "./auth.api";

export const useAuthActions = () => {
  const router = useRouter();
  const [loginMutation, { loading: loginLoading, error: loginError }] = useMutation(LOGIN_MUTATION);
  const [signupMutation, { loading: signupLoading, error: signupError }] = useMutation(SIGNUP_MUTATION);

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem("token", token);
    router.push("/");
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
    loading: loginLoading || signupLoading,
    error: loginError || signupError,
  };
};
