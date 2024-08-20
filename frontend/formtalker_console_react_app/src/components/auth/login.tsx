import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Link, Navigate } from "react-router-dom";
import { getCurrentUser, signIn } from "@/services/supabase/auth";
import { AlertBox } from "@/components/share/alert";
import { pageLinks } from "@/utils/pageLinks";
interface LoginProps {
  loggedIn: boolean;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

export const Login: React.FC<LoginProps> = ({ loggedIn, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      const user = await getCurrentUser();
      setUser(user);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };
  return (
    <>
      {error && (
        <AlertBox message={{ title: "SignIn error!", description: error }} />
      )}
      {loggedIn && <Navigate to={pageLinks.home}></Navigate>}
      <div className="flex h-screen">
        <div className="m-auto">
          <ul className=" space-y-5">
            <li className="flex justify-center">
              <h1 className="font-mono">Login</h1>
            </li>
            <li>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </li>
            <li>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </li>
            <li className="flex justify-center">
              <ul className="space-y-3">
                <li>
                  <Button onClick={handleSignIn}>login</Button>
                </li>
                <li className="flex justify-center">
                  <Link to={pageLinks.signUp} className="font-mono text-sm">
                    SignUp
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
