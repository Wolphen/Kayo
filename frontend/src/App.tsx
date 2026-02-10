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
