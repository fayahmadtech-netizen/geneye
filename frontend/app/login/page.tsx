"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("p.lewis@geneye.com");
  const [password, setPassword] = useState("12345");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // 1. Get Token
      const authRes = await authService.login(email, password);
      
      // 2. Fetch user profile via token
      localStorage.setItem("token", authRes.access_token);
      const user = await authService.getMe();
      
      // 3. Populate context and redirect
      login(authRes.access_token, user);
      
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
      localStorage.removeItem("token");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center border border-blue-200 dark:border-blue-500/30">
            <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          GENEYE Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Secure AI Platform Access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow-xl dark:shadow-2xl sm:rounded-xl border border-gray-200 dark:border-gray-800 sm:px-10 overflow-hidden relative transition-colors">
          
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-blue-500 blur-sm opacity-50 dark:opacity-100"></div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 p-3 rounded-md text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Sign in to Dashboard"
                )}
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-center mt-6 text-xs text-gray-500 dark:text-gray-600">
          GenEye Enterprise Platform © 2026. All rights reserved.
        </p>
      </div>
    </div>
  );
}
