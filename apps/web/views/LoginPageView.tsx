"use client";

import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        name
        email
      }
    }
  }
`;

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await login({ variables: { email, password } });
            if (data?.login?.token) {
                localStorage.setItem("token", data.login.token);
                router.push("/");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-[#0b1220]">
            <div className="w-full max-w-md rounded-lg bg-white dark:bg-[#101622] p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-black dark:bg-[#0f172a] dark:text-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-black dark:bg-[#0f172a] dark:text-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500">{error.message}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
