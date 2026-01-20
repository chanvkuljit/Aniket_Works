import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FlagIcon from "@mui/icons-material/Flag";
import { UserService } from "../../services";
import CarouselStructure from "./CarouselStructure";
import PTSessionsStrip from "./Ptsession";
  

const UserDashboard = () => {
  const fullName = localStorage.getItem("fullName");
  const [classList, setClassList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("strength");
  const [loading, setLoading] = useState(false);
  const [messagePurchasePlane, setMessagePurchasePlane] = useState("");

  const [error, setError] = useState(null);

  const [bookedIds, setBookedIds] = useState(new Set());
  const [bookingId, setBookingId] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [notificationData, setNotificationData] = useState(null);

  // layout constant — use the same value for both sections
  const PAGE_MAX_WIDTH = 1000;

  // Category list (these are the tabs)
  const categories = [
    { label: "Strength", value: "strength" },
    { label: "Cardio", value: "cardio" },
    { label: "Yoga", value: "yoga" },
    { label: "Mindfulness", value: "mindfulness" },
  ];

  // Mapping of category value -> color (LIVE CLASSES + button + left bar)
  const categoryColors = {
    strength: "#16a34a", // green
    cardio: "#2563eb", // blue
    yoga: "#ec4899", // pink
    mindfulness: "#7c3aed", // purple
  };

  useEffect(() => {
    const notificationsOfPlans = async () => {
      try {
        setLoading(true);
        const response = await UserService.notificationsService();
        setNotificationData(response?.data ?? null);
        setError(null);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load plan info");
      } finally {
        setLoading(false);
      }
    };
    notificationsOfPlans();
  }, []);

  const days = notificationData?.data?.daysRemaining;
  const planType = notificationData?.data?.planType;

  const fetchBookedClasses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await UserService.allBookedClassesForLoggedInUsers();
      const data = response?.data?.data ?? null;
      const bookingsArr = Array.isArray(data?.bookings) ? data.bookings : [];
      setTotalBookings(data?.totalBookings ?? bookingsArr.length ?? 0);
      setBookings(bookingsArr);

      const initiallyBooked = new Set();
      bookingsArr.forEach((b) => {
        if (b?.id) {
          if (b?.booked === true || typeof b?.booked === "undefined") {
            initiallyBooked.add(b.id);
          }
        }
      });
      setBookedIds(initiallyBooked);

      setError(null);
    } catch (err) {
      console.error("Error fetching booked classes:", err);
      setError(err?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookedClasses();
  }, [fetchBookedClasses]);

  const formatTimeToAMPM = (time) => {
    if (!time) return "TBA";
    const [hours, minutes] = ("" + time).split(":");
    const hour = parseInt(hours, 10);
    if (Number.isNaN(hour)) return time;
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes || "00"} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await UserService.fetchExerciseCategory(selectedCategory);
        const apiResponse = response?.data ?? {};
        const items = Array.isArray(apiResponse?.data) ? apiResponse.data : [];

        if (apiResponse?.success && items.length > 0) {
          const transformed = items.map((item) => ({
            id: item.id,
            date: item.date,
            time: formatTimeToAMPM(item.startTime),
            duration: `${item.durationInMinutes} min`,
            className: item.className,
            trainerName: item.trainerName,
            category: item.category,
            joinUrl: item.joinUrl,
            booked: !!item.booked,
          }));
          setClassList(transformed);
        } else {
          setClassList([]);
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes. Please try again.");
        setClassList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [selectedCategory]);

  const handleJoinClass = (cls) => {
    const url = cls?.joinUrl;
    if (!url) {
      alert("Join link not available.");
      return;
    }
    try {
      const u = new URL(url);
      const win = window.open(u.href, "_blank");
      if (win) try { win.opener = null; } catch (e) {}
    } catch (err) {
      console.error("Invalid join URL", err);
      alert("Join link not available.");
    }
  };

  const markBooked = (id) => {
    setBookedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleBookClass = async (cls) => {
    if (!cls?.id) {
      alert("❌ Class ID is missing. Cannot book.");
      return;
    }
    const classId = cls.id;
    setBookingId(classId);
    try {
      const bookingResponse = await UserService.bookClasses(classId);
      const code = bookingResponse?.data?.code;
      const message = bookingResponse?.data?.message ?? "";

      if (code === "BOOKED") {
        markBooked(classId);
        await fetchBookedClasses();
      }

      alert(`${code ?? "OK"}\n${message}`);
    } catch (err) {
      console.error("Booking failed", err);
      alert(`Failed to book: ${err?.response?.data?.message || err.message || err}`);
    } finally {
      setBookingId(null);
    }
  };

  // case-insensitive color lookup
  const getCategoryColor = (category) =>
    categoryColors[(category || "").toString().toLowerCase()] || "#374151";

  return (
    <>
      <Box sx={{ p: { xs: 2, md: 3 }, minHeight: "100vh" }}>
        {/* TOP ROW: welcome + booked widget */}
        <Box
          sx={{
            mb: 4,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
            gap: 3,
            alignItems: "start",
            position: "relative",
          }}
        >
          <Box sx={{ gridColumn: "1 / 2", minWidth: 0 }}>
            <Typography variant="h4" fontWeight={700} color="#1a223f" mb={1}>
              Welcome back, {fullName ?? "Happy"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2,
                py: 0.6,
                border: "2px solid #32CD32",
                borderRadius: 1.5,
                fontSize: 15,
                fontWeight: 600,
                background: "#fff",
                width: "fit-content",
                minWidth: 240,
                mb: 1,
              }}
            >
              <Typography sx={{ fontWeight: 700, color: "#1a223f" }}>
                Remaining Days: {days ?? 5}
              </Typography>

              <Box
                sx={{
                  px: 1.5,
                  py: "3px",
                  borderRadius: 1,
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.06)",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#1a223f",
                }}
              >
                {planType ?? "FREE_TRIAL"}
              </Box>

              <Typography
                onClick={() => {}}
                sx={{
                  fontWeight: 700,
                  color: "#1a42f5",
                  cursor: "pointer",
                }}
              >
                Renew Now
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              gridColumn: { xs: "1 / 2", md: "2 / 3" },
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <Box sx={{ width: { xs: "100%", md: 600 }, maxWidth: "100%" }}>
              
              <Box sx={{ width: "100%", "& h2": { display: "none" }, mt: 0 }}>
                <CarouselStructure
                  bookings={bookings}
                  loading={loading}
                  fetchBookedClasses={fetchBookedClasses}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Practice Record — fully responsive, minimal change */}
        <Box
          sx={{
            mb: 4,
            width: "100%",
            maxWidth: PAGE_MAX_WIDTH,
            mx: "auto",
            px: { xs: 1, md: 2 },
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={800}
            color="#1a223f"
            mb={3}
            align="center"
            sx={{ letterSpacing: 0.5 }}
          >
            Practice Record
          </Typography>

          {/* Responsive layout: stack on xs, row on md+ */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 3 },
              justifyContent: "space-between",
              alignItems: "stretch",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {[ 
              { key: "booked", Icon: EventAvailableIcon, label: "Classes Booked", value: totalBookings ?? "—", color: "#16a34a" },
              { key: "hours", Icon: ScheduleIcon, label: "Practice Hour", value: "--", color: "#2563eb" },
              { key: "goal", Icon: FlagIcon, label: "Weekly Goal", value: "--", color: "#7c3aed" },
            ].map(({ key, Icon, label, value, color }) => (
              <Box
                key={key}
                sx={{
                  flex: { xs: "1 1 100%", md: "0 0 calc((100% - (2 * 24px)) / 3)" },
                  height: { xs: "auto", md: 140 },
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  background: "#fff",
                  borderRadius: 2,
                  boxShadow: "0 3px 14px rgba(0,0,0,0.06)",
                  p: { xs: 2, md: 3 },
                  boxSizing: "border-box",
                  minWidth: 0,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 8,
                    backgroundColor: color,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />

                <Box sx={{ width: { xs: 56, md: 70 }, minWidth: { xs: 56, md: 70 }, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Icon sx={{ fontSize: { xs: 36, md: 52 }, color }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: "#6b7280",
                      fontWeight: 700,
                      mb: 1,
                      fontSize: { xs: 14, md: 16 },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {label}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#1a223f",
                      fontWeight: 900,
                      fontSize: { xs: 28, md: 40 },
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Live Classes (alignment only — no logic change) */}
        <Box
          sx={{
            mt: 2,
            mb: 4,
            // Use the same horizontal constraints as Practice Record (px) to ensure exact left/right alignment
            px: { xs: 1, md: 2 },
            py: { xs: 1, md: 2 },
            borderRadius: 3,
            background: "#fafcff",
            border: "1px solid #f0f1f2",
            maxWidth: PAGE_MAX_WIDTH,
            mx: "auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#1a223f" mb={2}>
            Live Classes
          </Typography>

          <Tabs
            value={selectedCategory}
            onChange={(_, v) => setSelectedCategory(v)}
            variant="fullWidth"
            sx={{
              mb: 2,
              background: "#f5f6fa",
              borderRadius: 2,
              minHeight: 44,
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            {categories.map((cat) => {
              const tabColor = categoryColors[cat.value];
              const label = (cat.label || cat.value || "")
                .toString()
                .charAt(0)
                .toUpperCase() + (cat.label || cat.value || "").toString().slice(1).toLowerCase();

              return (
                <Tab
                  key={cat.value}
                  value={cat.value}
                  label={label}
                  sx={{
                    fontWeight: 600,
                    fontSize: 17,
                    minHeight: 44,
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                    transition: "color 0.15s, background 0.2s",
                    color: "#888",
                    backgroundColor: "transparent",
                    textTransform: "none", // prevent global uppercase from affecting it
                    "&.Mui-selected": {
                      color: tabColor,
                      fontWeight: 800,
                      backgroundColor: "transparent",
                    },
                    "&.Mui-selected .MuiTab-wrapper": {
                      color: tabColor,
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                  }}
                />
              );
            })}
          </Tabs>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && !loading && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && classList.length === 0 && (
            <Typography color="#6b7280" sx={{ mt: 2, mb: 2, ml: 1 }}>
              No upcoming classes found for {selectedCategory}.
            </Typography>
          )}

          {!loading && !error && classList.length > 0 && (
            <Box>
              {classList.map((cls) => {
                // determine accent color by class category (dynamic)
                const accent = getCategoryColor(cls.category);
                return (
                  <Grid
                    key={cls.id}
                    container
                    alignItems="center"
                    wrap="nowrap"
                    sx={{
                      background: "#fff",
                      borderRadius: 2,
                      p: 0,
                      mb: 2,
                      boxShadow: "0 1px 4px #f0f1f2",
                      overflow: "hidden",
                    }}
                  >
                    {/* left accent bar uses dynamic color */}
                    <Box sx={{ width: 8, background: accent }} />

                    <Grid item xs sx={{ p: 2, minWidth: 0 }}>
                      <Typography variant="caption" color="#1a223f" fontWeight={650} sx={{ mb: 0.5, display: "block" }}>
                        {formatDate(cls.date)}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700} color="#1a223f" mb={0.5}>
                        {cls.className}
                      </Typography>
                      <Typography variant="body2" color="#6b7280" mb={0.5}>
                        {cls.time} • {cls.duration}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs="auto"
                      sx={{
                        ml: "auto", // forces it to the far right
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        p: 2,
                        minWidth: { xs: 120, md: 160 },
                      }}
                    >
                      {/* Only the button reflects booking state; row stays colorful */}
                      {bookedIds.has(cls.id) ? (
                        cls.joinUrl ? (
                          <Button
                            variant="contained"
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                              fontSize: 15,
                              px: 2.5,
                              boxShadow: "none",
                              backgroundColor: accent,
                              color: "#fff",
                              minWidth: { xs: 'auto', md: 120 },
                              "&:hover": {
                                backgroundColor: accent,
                                opacity: 0.95,
                              },
                            }}
                            onClick={() => handleJoinClass(cls)}
                            disabled={bookingId !== null && bookingId !== cls.id}
                          >
                            Join
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                              fontSize: 15,
                              px: 2.5,
                              boxShadow: "none",
                              backgroundColor: accent,
                              color: "#fff",
                              minWidth: { xs: 'auto', md: 120 },
                              "&.Mui-disabled": {
                                opacity: 0.6,
                              },
                            }}
                            disabled
                          >
                            Booked
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: 15,
                            px: 2.5,
                            boxShadow: "none",
                            backgroundColor: accent,
                            color: "#fff",
                            minWidth: { xs: 'auto', md: 120 },
                            "&:hover": {
                              backgroundColor: accent,
                              opacity: 0.95,
                            },
                            "&.Mui-disabled": {
                              opacity: 0.6,
                            },
                          }}
                          onClick={() => handleBookClass(cls)}
                          disabled={bookingId !== null && bookingId !== cls.id}
                        >
                          {bookingId === cls.id ? "Booking..." : "Book Now"}
                        </Button>
                      )}
                      {/* <-- STRAY PTSessionsStrip REMOVED FROM HERE */}
                    </Grid>
                  </Grid>
                );
              })}
            </Box>
          )}
        </Box>

        {/* PT Session Strip: single instance, aligned using same wrapper constraints */}
        <Box
          sx={{
            mt: 3,
            mb: 6,
            maxWidth: PAGE_MAX_WIDTH,
            mx: "auto",
            px: { xs: 1, md: 2 },
            boxSizing: "border-box",
          }}
        >
          <PTSessionsStrip onEnquire={() => console.log("Enquire Now clicked")} />
        </Box>

      </Box>
    </>
  );
};

export default UserDashboard;
