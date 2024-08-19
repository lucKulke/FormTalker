import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { signUp } from "@/services/supabase/auth";
import { AlertBox } from "@/components/share/alert";

export const SingUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      // Handle successful sign in (e.g., navigate to dashboard)
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
      <div className="flex h-screen">
        <div className="m-auto">
          <ul className=" space-y-5">
            <li className="flex justify-center">
              <h1 className="font-mono">SignUp</h1>
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
              <Button onClick={handleSignUp}>SignUp</Button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
