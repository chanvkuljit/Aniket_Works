import React from "react";

export default function PTSessionsStrip({ onEnquire = () => {} }) {
  const green = "#10B981";

  return (
    <section style={{ width: "100%", boxSizing: "border-box" }}>
      <div
        style={{
          width: "100%",
          background: "#f3f4f6",
          borderTop: `6px solid ${green}`,
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(16,24,40,0.06)",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        {/* LEFT CONTENT */}
        <div style={{ flex: 1, paddingRight: 20 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Transform Your Fitness With 1:1 Personal Training
          </h2>

          <ul
            style={{
              marginTop: 12,
              marginBottom: 12,
              paddingLeft: 20,
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            <li>Personalised training plan tailored to your goals.</li>
            <li>1-on-1 coaching with continuous progress tracking.</li>
            <li>Workouts designed specifically for your body & lifestyle.</li>
          </ul>

          <p
            style={{
              margin: 0,
              color: "#374151",
              fontWeight: 600,
            }}
          >
            Perfect for beginners, intermediates, or anyone stuck in progress.
          </p>
        </div>

        {/* RIGHT-CENTER BUTTON */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
          }}
        >
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
    padding: "10px 18px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    whiteSpace: "nowrap",
  }}
>
  Enquire Now
</button>

        </div>
      </div>
    </section>
  );
}
