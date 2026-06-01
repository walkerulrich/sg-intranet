import React, { useEffect, useState } from "react";
import { Search, Mail, Building } from "lucide-react";
import { api } from "../services/api";

export function Employees() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    api.listUsers().then((data) => {
      setUsers(data);
      setFiltered(data);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(users);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      users.filter((u) =>
        u.full_name.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      )
    );
  }, [search, users]);

  return (
    <div style={{ background: "var(--sg-gray-50)", minHeight: "calc(100vh - 72px)" }}>
      {/* Header section */}
      <section style={{
        background: "var(--sg-white)",
        padding: "64px 48px 48px",
        borderBottom: "1px solid var(--sg-gray-300)",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "var(--sg-red)",
            textTransform: "uppercase",
            fontWeight: "700",
            marginBottom: "12px",
          }}>
            — Annuaire interne
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "64px",
            fontWeight: "400",
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}>
            Nos <span style={{ fontStyle: "italic", color: "var(--sg-red)" }}>collaborateurs</span>
          </h1>
          <p style={{ fontSize: "16px", color: "var(--sg-gray-700)", maxWidth: "600px", marginBottom: "40px" }}>
            Trouvez et contactez vos collègues. {users.length} membres dans l'équipe Tech.
          </p>

          {/* Recherche */}
          <div style={{
            position: "relative",
            maxWidth: "500px",
          }}>
            <Search
              size={18}
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--sg-gray-500)" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, rôle ou département..."
              style={{
                width: "100%",
                padding: "16px 16px 16px 48px",
                fontSize: "15px",
                border: "1px solid var(--sg-gray-300)",
                background: "var(--sg-white)",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--sg-red)"}
              onBlur={(e) => e.target.style.borderColor = "var(--sg-gray-300)"}
            />
          </div>
        </div>
      </section>

      {/* Grille employés */}
      <section style={{ padding: "48px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {filtered.map((person, i) => (
            <article
              key={person.id}
              style={{
                background: "var(--sg-white)",
                padding: "32px",
                position: "relative",
                animation: `fadeUp 0.5s ease-out ${i * 0.05}s both`,
                transition: "all 0.3s",
                cursor: "pointer",
                borderLeft: "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderLeftColor = "var(--sg-red)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderLeftColor = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "20px" }}>
                <img
                  src={person.avatar_url}
                  alt={person.full_name}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid var(--sg-gray-100)",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: "400", marginBottom: "4px" }}>
                    {person.full_name}
                  </div>
                  <div style={{
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--sg-red)",
                    fontWeight: "700",
                  }}>
                    {person.role}
                  </div>
                </div>
              </div>

              {person.bio && (
                <p style={{
                  fontSize: "14px",
                  color: "var(--sg-gray-700)",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                  borderLeft: "2px solid var(--sg-gray-300)",
                  paddingLeft: "16px",
                  fontStyle: "italic",
                }}>
                  {person.bio}
                </p>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--sg-gray-700)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Building size={14} color="var(--sg-gray-500)" />
                  {person.department}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Mail size={14} color="var(--sg-gray-500)" />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{person.email}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--sg-gray-500)" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "32px", marginBottom: "8px" }}>
              Aucun résultat
            </div>
            <p>Essayez une autre recherche.</p>
          </div>
        )}
      </section>
    </div>
  );
}
