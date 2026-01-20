import React from "react";

export default function PTSessionsStrip({ onEnquire = () => {} }) {
  const green = "#10B981";
  const gray = "#f9fafb";
  const border = "#e5e7eb";
  const textPrimary = "#111827";
  const textSecondary = "#6b7280";

  return (
    <section style={{ width: "100%", boxSizing: "border-box" }}>
      <div
        style={{
          width: "100%",
          background: "#ffffff",
          border: `1px solid ${border}`,
          borderRadius: 8,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
          padding: "24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* HEADER */}
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 700,
              color: textPrimary,
              marginBottom: "16px",
            }}
          >
            Transform Your Fitness With 1:1 Personal Training
          </h2>

          {/* BULLET POINTS */}
          <ul
            style={{
              margin: 0,
              marginBottom: "16px",
              paddingLeft: "20px",
              color: textSecondary,
              lineHeight: 1.6,
              fontSize: "14px",
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              Personalised training plan tailored to your goals.
            </li>
            <li style={{ marginBottom: "8px" }}>
              1-on-1 coaching with continuous progress tracking.
            </li>
            <li>
              Workouts designed specifically for your body & lifestyle.
            </li>
          </ul>

          {/* FOOTER TEXT */}
          <p
            style={{
              margin: 0,
              color: textSecondary,
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Perfect for beginners, intermediates, or anyone stuck in progress.
          </p>
        </div>

        {/* BUTTON - BELOW */}
        <button
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSdx4ItUCiZxkGz6iQf_0uRRmstzEsDnKF7hRp7xPcSalWTLYA/viewform?embedded=true",
              "_blank"
            )
          }
          style={{
            background: green,
            color: "#ffffff",
            border: "none",
            padding: "12px 20px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            width: "100%",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#059669";
            e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = green;
            e.target.style.boxShadow = "none";
          }}
        >
          Enquire Now
        </button>
      </div>
    </section>
  );
}