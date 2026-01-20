import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";

function CarouselStructure({ bookings = [], loading = false, fetchBookedClasses }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  const goToNext = () => {
    if (!bookings || bookings.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bookings.length);
  };

  const goToPrevious = () => {
    if (!bookings || bookings.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? bookings.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    if (!bookings || index < 0 || index >= bookings.length) return;
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!bookings || bookings.length === 0) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prev) => Math.min(prev, bookings.length - 1));
  }, [bookings]);

  const formatDate = (dateLike) => {
    try {
      const d = new Date(dateLike);
      if (Number.isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatTime = (timeLike) => {
    if (!timeLike) return "N/A";
    const match = ("" + timeLike).match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (match) {
      const [_, hh, mm] = match;
      const d = new Date();
      d.setHours(parseInt(hh, 10));
      d.setMinutes(parseInt(mm, 10));
      d.setSeconds(0);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    }
    try {
      const d = new Date(timeLike);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
      }
    } catch {}
    return "N/A";
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Error: {error}</h2>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>No Bookings Found</h2>
      </div>
    );
  }

  const currentBooking = bookings[currentIndex];

  if (!currentBooking) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>No Booking Data Available</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentWidth}>
        <div style={styles.headerPlain}>
          <h2 style={styles.title}>Your Upcoming Classes</h2>
        </div>

        {/* Outer rounded ribbon (keeps card visually like your screenshot) */}
        <div style={styles.outerStrip}>
          <div style={styles.cardInner}>
            {/* Left time/date box */}
            <div style={styles.timeBoxWrapper}>
              <div style={styles.timeBoxInner}>
                <div style={styles.timeText}>{formatTime(currentBooking?.startTime)}</div>
                <div style={styles.dateTextSmall}>{currentBooking?.date ? formatDate(currentBooking.date) : "N/A"}</div>
              </div>
            </div>

            {/* Middle content: title + duration (title single line, duration below) */}
            <div style={styles.centerContent}>
              <div style={styles.titleRow}>
                <h3 style={styles.className}>{currentBooking?.className ?? "Class Name"}</h3>
              </div>
              <div style={styles.durationRow}>
                <div style={styles.infoLabel}>Duration</div>
                <div style={styles.infoValue}>{currentBooking?.durationInMinutes ?? "N/A"} min</div>
              </div>
            </div>

            {/* Right: Join button aligned to far right */}
            <div style={styles.rightAction}>
              <button
                type="button"
                style={styles.joinButton}
                onClick={() => {
                  const url = currentBooking?.joinUrl;
                  if (url) {
                    try {
                      const u = new URL(url);
                      const win = window.open(u.href, "_blank");
                      if (win) try { win.opener = null; } catch (e) {}
                    } catch {
                      alert("Join link not available");
                    }
                  } else {
                    alert("Join link not available");
                  }
                }}
              >
                Join Now
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* pagination dots (unchanged) */}
      <div style={styles.dotsContainer}>
        {bookings.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            style={{
              ...styles.dot,
              backgroundColor: index === currentIndex ? "#333" : "#e0e0e0",
            }}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
}

CarouselStructure.propTypes = {
  bookings: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  fetchBookedClasses: PropTypes.func,
};

CarouselStructure.defaultProps = {
  bookings: [],
  loading: false,
  fetchBookedClasses: undefined,
};

export default memo(CarouselStructure);

const styles = {
  container: {
    width: "100%",
    boxSizing: "border-box",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: "12px 16px",
  },

  contentWidth: {
    width: "920px",
    maxWidth: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
    background: "transparent",
  },

  headerPlain: {
    background: "transparent",
    padding: 0,
    margin: 0,
  },

  title: {
    textAlign: "left",
    color: "#222",
    margin: 0,
    padding: 0,
    fontSize: "20px",
    fontWeight: 700,
    lineHeight: 1.1,
    background: "transparent",
    borderRadius: 0,
    display: "block",
  },

  /* outer rounded strip that matches the screenshot structure */
  outerStrip: {
    width: "100%",
    borderRadius: 12,
    background: "#f3f4f6", // subtle strip behind the main inner card
    padding: 14,
    boxSizing: "border-box",
    marginTop: 10,
  },

  /* inner white card that holds the three-column layout */
  cardInner: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    background: "#ffffff",
    borderRadius: 10,
    padding: "12px 16px",
    boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
    border: "1px solid rgba(15,23,42,0.03)",
    boxSizing: "border-box",
    width: "100%",
  },

  /* left time box */
  timeBoxWrapper: {
    flex: "0 0 auto",
    paddingLeft: 6,
    paddingRight: 6,
  },
  timeBoxInner: {
    width: 110,
    height: 70,
    borderRadius: 12,
    background: "linear-gradient(180deg,#fff7ec 0%, #fffaf4 100%)", // preserved original style
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 18px rgba(255,160,50,0.06)",
    padding: "6px 8px",
    textAlign: "center",
    border: "1px solid rgba(0,0,0,0.08)",
  },
  timeText: {
    fontSize: "16px",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 6,
  },
  dateTextSmall: {
    fontSize: "12px",
    color: "#6b7280",
  },

  /* center: title on top line, duration beneath */
  centerContent: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
  },
  className: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 800,
    color: "#111827",
    lineHeight: 1.1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  durationRow: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  infoLabel: {
    fontSize: "12px",
    color: "#6b7280",
  },
  infoValue: {
    fontSize: "14px",
    color: "#111827",
    fontWeight: 700,
  },

  /* right action: join button pinned to the right */
  rightAction: {
    flex: "0 0 auto",
    display: "flex",
    alignItems: "center",
  },
  joinButton: {
    background: "linear-gradient(90deg, #a259ff 0%, #6a82fb 100%)", // preserved color
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(106,130,251,0.12)",
  },

  dotsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "12px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    padding: 0,
  },
};
