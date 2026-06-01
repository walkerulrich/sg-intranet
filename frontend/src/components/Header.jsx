import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Users, Image as ImageIcon, Home } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const NAV = [
  { path: "/", label: "Accueil", icon: Home },
  { path: "/employees", label: "Annuaire", icon: Users },
  { path: "/gallery", label: "Nos locaux", icon: ImageIcon },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={{
      background: "var(--sg-black)",
      color: "var(--sg-white)",
      padding: "0 48px",
      height: "72px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "4px solid var(--sg-red)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "40px",
          height: "40px",
          background: "var(--sg-red)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-serif)",
          fontSize: "22px",
          fontStyle: "italic",
        }}>
          SG
        </div>
        <div>
          <div style={{
            fontSize: "13px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: "700",
          }}>
            Société Générale
          </div>
          <div style={{
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "var(--sg-gray-500)",
          }}>
            Intranet collaborateurs
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav style={{ display: "flex", gap: "8px" }}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                fontSize: "13px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: "600",
                color: active ? "var(--sg-white)" : "var(--sg-gray-500)",
                borderBottom: active ? "2px solid var(--sg-red)" : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profil utilisateur */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "13px", fontWeight: "600" }}>{user?.full_name}</div>
          <div style={{ fontSize: "11px", color: "var(--sg-gray-500)", letterSpacing: "0.05em" }}>
            {user?.role}
          </div>
        </div>
        {user?.avatar_url && (
          <img
            src={user.avatar_url}
            alt={user.full_name}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "2px solid var(--sg-red)",
              objectFit: "cover",
            }}
          />
        )}
        <button
          onClick={handleLogout}
          title="Déconnexion"
          style={{
            padding: "8px",
            color: "var(--sg-gray-500)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--sg-red)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--sg-gray-500)"}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
