import { useEffect, useState } from "react";
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilPage from "./pages/ProfilPage";
import DetailPostPage from "./pages/DetailPostPage";
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

  switch (pathname) {
    case "/":
      return <Homepage />;
    case "/register":
      return <RegisterPage />;
    case "/login":
      return <LoginPage />;
    case "/profil":
      return <ProfilPage />;
    default:
      break;
  }

  if (pathname.startsWith("/profil/")) {
    const parts = pathname.split("/").filter(Boolean);
    const id = parts[1] ?? "";
    return <ProfilPage userId={id} />;
  }

  if (pathname.startsWith("/detailPost/")) {
    const parts = pathname.split("/").filter(Boolean);
    const id = parts[1] ?? "";
    return <DetailPostPage postId={id} />;
  }

  return (
    <main
      style={{
        padding: "24px",
        fontFamily: "Avenir Next, Segoe UI, sans-serif",
      }}
    >
      <h1>Page non trouvee</h1>
      <p>Essaie /feed ou /register.</p>
    </main>
  );
}

export default App;
