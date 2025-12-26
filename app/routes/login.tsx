// app/routes/login.tsx
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

export default function Login() {
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <Button onClick={handleGoogleLogin}>Continue with Google</Button>
    </div>
  );
}