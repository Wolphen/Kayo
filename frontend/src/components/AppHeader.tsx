import "../assets/css/AppHeader.css";
import { useAuth } from "../context/AuthContext";

function AppHeader() {
  const { logout } = useAuth();

  const navigate = (path: string) => {
    if (window.location.pathname === path) return;
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <button
          type="button"
          className="app-brand"
          onClick={() => navigate("/")}
          aria-label="Aller a l'accueil"
        >
          <span className="app-brand-logo">K</span>
          <span className="app-brand-name">Kayo</span>
        </button>

        <div className="app-header-actions">
          <a className="app-header-icon-btn" href="/profil" aria-label="Profil">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </a>

          <button
            type="button"
            className="app-header-icon-btn app-header-logout"
            onClick={logout}
            aria-label="Deconnexion"
            title="Deconnexion"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v10" />
              <path d="M7.5 5.8a8 8 0 1 0 9 0" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
