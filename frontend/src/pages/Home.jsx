import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Image as ImageIcon, TrendingUp } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export function Home() {
  const { user } = useAuth();
  const [colleagues, setColleagues] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    api.listUsers().then(setColleagues).catch(console.error);
    api.listPhotos().then(setPhotos).catch(console.error);
  }, []);

  const featuredPhotos = photos.slice(0, 3);

  return (
    <div style={{ background: "var(--sg-gray-50)", minHeight: "calc(100vh - 72px)" }}>
      {/* Hero section */}
      <section style={{
        background: "var(--sg-white)",
        padding: "80px 48px 64px",
        borderBottom: "1px solid var(--sg-gray-300)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Décoration géométrique */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "300px",
          height: "100%",
          background: "var(--sg-black)",
          clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
          opacity: 0.04,
        }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
          <div style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "var(--sg-red)",
            textTransform: "uppercase",
            fontWeight: "700",
            marginBottom: "16px",
            animation: "fadeUp 0.6s ease-out",
          }}>
            — {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>

          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "84px",
            lineHeight: "0.95",
            fontWeight: "400",
            letterSpacing: "-0.03em",
            color: "var(--sg-black)",
            marginBottom: "24px",
            animation: "fadeUp 0.6s ease-out 0.1s both",
          }}>
            Bonjour {user?.full_name?.split(" ")[0]},<br />
            <span style={{ fontStyle: "italic", color: "var(--sg-red)" }}>bienvenue.</span>
          </h1>

          <p style={{
            fontSize: "18px",
            color: "var(--sg-gray-700)",
            maxWidth: "600px",
            lineHeight: "1.6",
            animation: "fadeUp 0.6s ease-out 0.2s both",
          }}>
            Découvrez votre annuaire interne, explorez les locaux de la Société Générale et restez connecté à la vie de l'entreprise.
          </p>
        </div>
      </section>

      {/* Stats cards */}
      <section style={{ padding: "48px 48px 0", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          <StatCard
            icon={Users}
            label="Collaborateurs"
            value={colleagues.length}
            description="Membres de l'équipe Tech"
            link="/employees"
          />
          <StatCard
            icon={ImageIcon}
            label="Photos"
            value={photos.length}
            description="Moments de vie partagés"
            link="/gallery"
          />
          <StatCard
            icon={TrendingUp}
            label="Engagement"
            value="98%"
            description="Satisfaction collaborateurs"
          />
        </div>
      </section>

      {/* Section : aperçu galerie */}
      <section style={{ padding: "64px 48px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "32px",
        }}>
          <div>
            <div style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "var(--sg-red)",
              textTransform: "uppercase",
              fontWeight: "700",
              marginBottom: "8px",
            }}>
              — La vie chez SG
            </div>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "44px",
              fontWeight: "400",
              letterSpacing: "-0.02em",
            }}>
              Nos locaux en images
            </h2>
          </div>
          <Link
            to="/gallery"
            style={{
              fontSize: "13px",
              fontWeight: "600",
              letterSpacing: "0.05em",
              color: "var(--sg-black)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: "2px solid var(--sg-red)",
              paddingBottom: "4px",
            }}
          >
            VOIR TOUTE LA GALERIE <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {featuredPhotos.map((photo, i) => (
            <Link
              key={photo.id}
              to="/gallery"
              style={{
                animation: `fadeUp 0.6s ease-out ${0.1 + i * 0.1}s both`,
                position: "relative",
                overflow: "hidden",
                aspectRatio: "4/5",
                background: "var(--sg-charcoal)",
                display: "block",
                transition: "transform 0.4s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <img
                src={photo.image_url}
                alt={photo.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.6s",
                }}
              />
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "24px",
                background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                color: "var(--sg-white)",
              }}>
                <div style={{
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--sg-red)",
                  marginBottom: "6px",
                }}>
                  {photo.category}
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", lineHeight: "1.2" }}>
                  {photo.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section : équipe */}
      <section style={{ background: "var(--sg-black)", color: "var(--sg-white)", padding: "80px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "48px" }}>
            <div>
              <div style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: "var(--sg-red)",
                textTransform: "uppercase",
                fontWeight: "700",
                marginBottom: "8px",
              }}>
                — Annuaire
              </div>
              <h2 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "44px",
                fontWeight: "400",
                letterSpacing: "-0.02em",
              }}>
                Votre équipe
              </h2>
            </div>
            <Link
              to="/employees"
              style={{
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: "0.05em",
                color: "var(--sg-white)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: "2px solid var(--sg-red)",
                paddingBottom: "4px",
              }}
            >
              VOIR L'ANNUAIRE COMPLET <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {colleagues.slice(0, 4).map((person, i) => (
              <div
                key={person.id}
                style={{
                  padding: "24px",
                  border: "1px solid var(--sg-charcoal)",
                  animation: `fadeUp 0.6s ease-out ${0.1 + i * 0.08}s both`,
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--sg-charcoal)";
                  e.currentTarget.style.borderColor = "var(--sg-red)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "var(--sg-charcoal)";
                }}
              >
                <img
                  src={person.avatar_url}
                  alt={person.full_name}
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    marginBottom: "16px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
                  {person.full_name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--sg-red)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {person.role}
                </div>
                <div style={{ fontSize: "12px", color: "var(--sg-gray-500)", marginTop: "8px" }}>
                  {person.department}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "32px 48px", background: "var(--sg-white)", borderTop: "1px solid var(--sg-gray-300)" }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "var(--sg-gray-700)",
          letterSpacing: "0.05em",
        }}>
          <span>© 2026 Société Générale — Tous droits réservés</span>
          <span>Intranet collaborateurs · Édition technique</span>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, description, link }) {
  const content = (
    <div style={{
      background: "var(--sg-white)",
      padding: "32px",
      borderTop: "3px solid var(--sg-red)",
      transition: "all 0.3s",
      cursor: link ? "pointer" : "default",
      height: "100%",
    }}
    onMouseEnter={(e) => link && (e.currentTarget.style.transform = "translateY(-4px)")}
    onMouseLeave={(e) => link && (e.currentTarget.style.transform = "translateY(0)")}
    >
      <Icon size={28} color="var(--sg-red)" style={{ marginBottom: "16px" }} />
      <div style={{
        fontFamily: "var(--font-serif)",
        fontSize: "56px",
        lineHeight: "1",
        fontWeight: "400",
        marginBottom: "8px",
      }}>
        {value}
      </div>
      <div style={{
        fontSize: "11px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--sg-black)",
        fontWeight: "700",
        marginBottom: "4px",
      }}>
        {label}
      </div>
      <div style={{ fontSize: "13px", color: "var(--sg-gray-700)" }}>
        {description}
      </div>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
}
