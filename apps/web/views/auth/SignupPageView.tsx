"use client";

import { useState } from "react";
import { useAuthActions } from "@/modules/auth/auth.hooks";
import { Button, Input } from "@/components/ui";


export const SignupView = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {signup, loading, error} = useAuthActions();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-[#0b1220]">
            <div className="w-full max-w-md rounded-lg bg-white dark:bg-[#101622] p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
                    Sign Up
                </h1>

                <form onSubmit={(e) => { e.preventDefault(); signup({ name, email, password }); }} className="space-y-4">
                    <Input
                        label="Name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                   
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
                        {loading ? "Sign in..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
