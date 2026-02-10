import { useEffect, useState } from "react";
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilPage from "./pages/ProfilPage";

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
