import { useAuth } from "../context/AuthContext";

function Homepage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.history.pushState({}, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <main className="feed-empty-page">
      <h1>Bonjour {user?.username ?? "invité"}</h1>
      <button type="button" onClick={handleLogout}>
        Logout (debug)
      </button>
    </main>
  );
}

export default Homepage;
