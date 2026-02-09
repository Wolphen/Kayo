import { useState } from "react";
import { Alert, Button, Card, ToggleSwitch } from "flowbite-react";
import "./assets/css/auth.css";

function App() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  };

  return (
    <>
      <div className="page">
        <Card className="form-card">
          <h1 className="form-title">Register</h1>
          <form onSubmit={handleSubmit} className="form">
            <div className="relative">
              <input
                type="text"
                id="username"
                className="block w-full appearance-none rounded-base border-1 border-default-medium bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-heading focus:border-brand focus:outline-none focus:ring-0 peer"
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
              <label
                htmlFor="username"
                className="absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-neutral-primary px-2 text-sm text-body duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-fg-brand rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
              >
                Username
              </label>
            </div>
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
                Email
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
                autoComplete="new-password"
                required
              />
              <label
                htmlFor="password"
                className="absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-neutral-primary px-2 text-sm text-body duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-fg-brand rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                className="block w-full appearance-none rounded-base border-1 border-default-medium bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-heading focus:border-brand focus:outline-none focus:ring-0 peer"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <label
                htmlFor="confirmPassword"
                className="absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-neutral-primary px-2 text-sm text-body duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-fg-brand rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
              >
                Confirm Password
              </label>
            </div>

            <div className="toggle-row">
              <ToggleSwitch
                checked={isPublic}
                label={isPublic ? "Private profile" : "Public profile"}
                onChange={setIsPublic}
              />
            </div>

            {error ? <Alert color="failure">{error}</Alert> : null}

            <Button type="submit" className="w-full test text-black">
              Create account
            </Button>
          </form>
          <p className="form-footer">
            Already have an account? <a href="#">Log in</a>
          </p>
        </Card>
      </div>
    </>
  );
}

export default App;
