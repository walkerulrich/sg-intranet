import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login(username, password);
      login(res.access_token, res.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: "var(--sg-white)",
    }}>
      {/* Côté gauche — visuel SG */}
      <div style={{
        background: "var(--sg-black)",
        color: "var(--sg-white)",
        padding: "48px 56px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Bandeau rouge décoratif */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "8px",
          height: "100%",
          background: "var(--sg-red)",
        }} />

        {/* Logo SG */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", animation: "fadeUp 0.6s ease-out" }}>
          <div style={{
            width: "48px",
            height: "48px",
            background: "var(--sg-red)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-serif)",
            fontSize: "26px",
            fontWeight: "400",
            fontStyle: "italic",
          }}>
            SG
          </div>
          <div>
            <div style={{ fontSize: "13px", letterSpacing: "0.15em", color: "var(--sg-gray-500)", textTransform: "uppercase" }}>
              Société Générale
            </div>
            <div style={{ fontSize: "11px", letterSpacing: "0.1em", color: "var(--sg-gray-700)" }}>
              Espace collaborateurs
            </div>
          </div>
        </div>

        {/* Citation / Tagline */}
        <div style={{ animation: "fadeUp 0.8s ease-out 0.2s both" }}>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "72px",
            lineHeight: "0.95",
            fontWeight: "400",
            letterSpacing: "-0.02em",
            marginBottom: "24px",
          }}>
            Bienvenue<br />
            <span style={{ fontStyle: "italic", color: "var(--sg-red)" }}>chez nous.</span>
          </h1>
          <p style={{
            fontSize: "16px",
            color: "var(--sg-gray-300)",
            maxWidth: "440px",
            lineHeight: "1.6",
          }}>
            Découvrez l'annuaire de votre équipe, l'ambiance de nos locaux et tout ce qui fait la richesse de notre culture d'entreprise.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "var(--sg-gray-700)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          <span>Paris · La Défense</span>
          <span>Édition 2026</span>
        </div>
      </div>

      {/* Côté droit — formulaire */}
      <div style={{
        padding: "64px 80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "600px",
        margin: "0 auto",
        width: "100%",
      }}>
        <div style={{ animation: "fadeUp 0.6s ease-out 0.1s both" }}>
          <div style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "var(--sg-red)",
            textTransform: "uppercase",
            marginBottom: "16px",
            fontWeight: "600",
          }}>
            — Connexion sécurisée
          </div>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "48px",
            fontWeight: "400",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
          }}>
            Accéder à l'intranet
          </h2>
          <p style={{ color: "var(--sg-gray-700)", marginBottom: "48px", fontSize: "15px" }}>
            Utilisez vos identifiants Société Générale.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--sg-gray-700)",
                marginBottom: "8px",
                fontWeight: "600",
              }}>
                Identifiant
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="alice"
                required
                style={{
                  width: "100%",
                  padding: "14px 0",
                  fontSize: "16px",
                  border: "none",
                  borderBottom: "2px solid var(--sg-gray-300)",
                  background: "transparent",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--sg-red)"}
                onBlur={(e) => e.target.style.borderColor = "var(--sg-gray-300)"}
              />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{
                display: "block",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--sg-gray-700)",
                marginBottom: "8px",
                fontWeight: "600",
              }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "14px 0",
                  fontSize: "16px",
                  border: "none",
                  borderBottom: "2px solid var(--sg-gray-300)",
                  background: "transparent",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--sg-red)"}
                onBlur={(e) => e.target.style.borderColor = "var(--sg-gray-300)"}
              />
            </div>

            {error && (
              <div style={{
                padding: "12px 16px",
                background: "var(--sg-red-light)",
                borderLeft: "3px solid var(--sg-red)",
                color: "var(--sg-red-dark)",
                fontSize: "13px",
                marginBottom: "24px",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "18px",
                background: "var(--sg-black)",
                color: "var(--sg-white)",
                fontSize: "13px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: "600",
                transition: "all 0.2s",
                opacity: loading ? 0.6 : 1,
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "var(--sg-red)")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "var(--sg-black)")}
            >
              {loading ? "Connexion en cours..." : "Se connecter →"}
            </button>
          </form>

          {/* Comptes de démo */}
          <div style={{
            marginTop: "48px",
            padding: "20px",
            background: "var(--sg-gray-50)",
            borderLeft: "3px solid var(--sg-red)",
          }}>
            <div style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "var(--sg-gray-700)",
              textTransform: "uppercase",
              fontWeight: "700",
              marginBottom: "12px",
            }}>
              Comptes de démonstration
            </div>
            <div style={{ fontSize: "13px", color: "var(--sg-gray-700)", fontFamily: "monospace", lineHeight: "1.8" }}>
              <div><strong></strong> </div>
              <div><strong></strong> </div>
              <div><strong></strong> </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
