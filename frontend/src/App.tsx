import { useEffect, useState } from "react";
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilPage from "./pages/ProfilPage";
import { useAuth } from "./context/AuthContext";

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const { token } = useAuth();

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const isAuthPage = pathname === "/login" || pathname === "/register";

    if (token && isAuthPage) {
      navigate("/");
      return;
    }

    if (!token && !isAuthPage) {
      navigate("/login");
    }
  }, [token, pathname]);

  if (pathname === "/") {
    return <Homepage />;
  }

  if (pathname === "/register") {
    return <RegisterPage />;
  }

  if (pathname === "/login") {
    return <LoginPage />;
  }

  if (pathname === "/profil") {
    return <ProfilPage />;
  }

  return (
    <main style={{ padding: "24px", fontFamily: "Avenir Next, Segoe UI, sans-serif" }}>
      <h1>Page non trouvee</h1>
      <p>Essaie /feed ou /register.</p>
    </main>
  );
}

export default App;
