import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button, Card } from "flowbite-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import "../assets/css/auth.css";

function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login } = useAuth();

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  useEffect(() => {
    const existingUser = localStorage.getItem("currentUser");
    if (existingUser) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const { user, token } = response.data as {
        user: {
          id: string;
          email: string;
          username: string;
          isAdmin?: boolean;
          photoUrl?: string;
          bio?: string;
          isPublic?: boolean;
        };
        token: string;
      };

      login(token, user);
      setSuccess("Login successful.");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setError(message || "Login failed/API ERROR");
      } else {
        setError("Login failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <Card className="form-card">
        <h1 className="form-title">Login</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="relative">
            <input
              type="email"
              id="email"
              className="block w-full appearance-none rounded-base border-1 border-default-medium bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-heading focus:border-brand focus:outline-none focus:ring-0 peer"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <label
              htmlFor="email"
              className="absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-neutral-primary px-2 text-sm text-body duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-fg-brand rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            >
              Mail
            </label>
          </div>
          <div className="relative">
            <input
              type="password"
              id="password"
              className="block w-full appearance-none rounded-base border-1 border-default-medium bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-heading focus:border-brand focus:outline-none focus:ring-0 peer"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <label
              htmlFor="password"
              className="absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-neutral-primary px-2 text-sm text-body duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-fg-brand rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            >
              Password
            </label>
          </div>

          {error ? <Alert color="failure">{error}</Alert> : null}
          {success ? <Alert color="success">{success}</Alert> : null}

          <Button
            type="submit"
            className="w-full test text-black"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verification..." : "Se connecter"}
          </Button>
        </form>
        <p className="form-footer">
          No account yet ? <a href="/register">Register</a>
        </p>
      </Card>
    </div>
  );
}

export default LoginPage;
