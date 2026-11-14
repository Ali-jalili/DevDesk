/** @format */

import supabase from "@/lib/supabase";

import type { User } from "@supabase/supabase-js";

import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;

  isLoading: boolean;

  handleSignUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<User | null>;

  handleSignIn: (email: string, password: string) => Promise<User | null>;

  handleSignOut: () => Promise<void>;

  handlePasswordReset: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }

        setIsLoading(false);
      },
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSignUp(
    name: string,
    email: string,
    password: string,
  ): Promise<User | null> {
    const { data, error } = await supabase.auth.signUp({
      email,

      password,

      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw error;
    }

    return data.user;
  }

  async function handleSignIn(
    email: string,
    password: string,
  ): Promise<User | null> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,

      password,
    });

    if (error) {
      throw error;
    }

    return data.user;
  }

  async function handleSignOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }

  async function handlePasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,

        isLoading,

        handleSignUp,

        handleSignIn,

        handleSignOut,

        handlePasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
