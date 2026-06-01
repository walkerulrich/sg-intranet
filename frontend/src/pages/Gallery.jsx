import React, { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import { api } from "../services/api";

const CATEGORIES = [
  { key: null, label: "Toutes" },
  { key: "batiment", label: "Bâtiments" },
  { key: "bureau", label: "Bureaux" },
  { key: "ambiance", label: "Ambiance" },
  { key: "reunion", label: "Réunions" },
  { key: "evenement", label: "Événements" },
];

export function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.listPhotos(category).then(setPhotos).catch(console.error);
  }, [category]);

  return (
    <div style={{ background: "var(--sg-gray-50)", minHeight: "calc(100vh - 72px)" }}>
      {/* Header section */}
      <section style={{
        background: "var(--sg-black)",
        color: "var(--sg-white)",
        padding: "80px 48px 64px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "12px",
          height: "100%",
          background: "var(--sg-red)",
        }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "var(--sg-red)",
            textTransform: "uppercase",
            fontWeight: "700",
            marginBottom: "16px",
          }}>
            — Visite des locaux
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "84px",
            lineHeight: "0.95",
            fontWeight: "400",
            letterSpacing: "-0.03em",
            marginBottom: "24px",
          }}>
            La vie<br />
            <span style={{ fontStyle: "italic", color: "var(--sg-red)" }}>chez SG.</span>
          </h1>
          <p style={{ fontSize: "17px", color: "var(--sg-gray-300)", maxWidth: "600px", lineHeight: "1.6" }}>
            De la Défense à nos espaces de coworking, plongez dans l'ambiance quotidienne de la Société Générale.
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section style={{
        padding: "32px 48px",
        background: "var(--sg-white)",
        borderBottom: "1px solid var(--sg-gray-300)",
        position: "sticky",
        top: 72,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => {
            const active = cat.key === category;
            return (
              <button
                key={cat.label}
                onClick={() => setCategory(cat.key)}
                style={{
                  padding: "10px 20px",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: "600",
                  border: `1px solid ${active ? "var(--sg-red)" : "var(--sg-gray-300)"}`,
                  background: active ? "var(--sg-red)" : "transparent",
                  color: active ? "var(--sg-white)" : "var(--sg-gray-700)",
                  transition: "all 0.2s",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grille masonry */}
      <section style={{ padding: "48px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          columnCount: 3,
          columnGap: "24px",
        }}>
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              onClick={() => setSelected(photo)}
              style={{
                breakInside: "avoid",
                marginBottom: "24px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                background: "var(--sg-black)",
                animation: `fadeUp 0.5s ease-out ${i * 0.05}s both`,
              }}
            >
              <img
                src={photo.image_url}
                alt={photo.title}
                style={{
                  width: "100%",
                  display: "block",
                  transition: "transform 0.6s, opacity 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.opacity = "1";
                }}
              />
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "20px",
                background: "linear-gradient(to top, rgba(0,0,0,0.9) 30%, transparent)",
                color: "var(--sg-white)",
                pointerEvents: "none",
              }}>
                <div style={{
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--sg-red)",
                  fontWeight: "700",
                  marginBottom: "6px",
                }}>
                  {photo.category}
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", lineHeight: "1.2", marginBottom: "4px" }}>
                  {photo.title}
                </div>
                {photo.location && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--sg-gray-300)" }}>
                    <MapPin size={11} />
                    {photo.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal photo */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "32px",
            animation: "fadeUp 0.2s ease-out",
          }}
        >
          <button
            onClick={() => setSelected(null)}
            style={{
              position: "absolute",
              top: 32,
              right: 32,
              color: "var(--sg-white)",
              padding: "12px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--sg-red)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--sg-white)"}
          >
            <X size={28} />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "1100px",
              width: "100%",
              maxHeight: "90vh",
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              background: "var(--sg-white)",
            }}
          >
            <img
              src={selected.image_url}
              alt={selected.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", maxHeight: "90vh" }}
            />
            <div style={{ padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--sg-red)",
                fontWeight: "700",
                marginBottom: "12px",
              }}>
                — {selected.category}
              </div>
              <h2 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "36px",
                lineHeight: "1.1",
                fontWeight: "400",
                marginBottom: "16px",
              }}>
                {selected.title}
              </h2>
              {selected.description && (
                <p style={{ fontSize: "15px", color: "var(--sg-gray-700)", lineHeight: "1.6", marginBottom: "24px" }}>
                  {selected.description}
                </p>
              )}
              {selected.location && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13px",
                  color: "var(--sg-gray-500)",
                  paddingTop: "24px",
                  borderTop: "1px solid var(--sg-gray-300)",
                }}>
                  <MapPin size={14} />
                  {selected.location}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
