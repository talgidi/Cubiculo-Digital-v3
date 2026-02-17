"use client";
import { useGoogleLogin } from '@react-oauth/google';
import { Chrome } from 'lucide-react';
import { useState } from "react";
import { useAuthActions } from "@/modules/auth/auth.hooks";
import { Button, Input } from "@/components/ui";
import { AuthCloseButton } from "@/components/shared/AuthCloseButton";

export const LoginView = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loginWithGoogle, login, loading, error } = useAuthActions();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => loginWithGoogle(codeResponse.access_token),
        onError: () => console.error("Error en el popup de Google")
    });

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-[#0b1220]">
            <div className="relative w-full max-w-md rounded-lg bg-white dark:bg-[#101622] p-8 shadow-md">
                <AuthCloseButton />
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">Login</h1>
                <Button 
                    variant="outline" 
                    onClick={() => handleGoogleLogin()} 
                    disabled={loading}
                    className="w-full gap-3 mb-6"
                    >
                    <Chrome className="size-5" />
                    Continuar con Google
                </Button>
                <form onSubmit={(e) => { e.preventDefault(); login({ email, password }); }} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="text-sm text-red-500">{error.message}</p>}
                    
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading}
                    >
                        {loading ? "Login in..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
