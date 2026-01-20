import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Container,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FlagIcon from "@mui/icons-material/Flag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { UserService } from "../../services";
import CarouselStructure from "./CarouselStructure";
import Ptsession from "./Ptsession";

// Minimalist Design System - Soft Rounded Corners
const THEME = {
  colors: {
    primary: "#10b981",
    secondary: "#3b82f6",
    accent: "#8b5cf6",
    background: "#ffffff",
    surface: "#f9fafb",
    border: "#e5e7eb",
    text: {
      primary: "#111827",
      secondary: "#6b7280",
      light: "#9ca3af",
    },
    status: {
      success: "#10b981",
      info: "#3b82f6",
      warning: "#f59e0b",
    },
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: 8,
  shadow: {
    none: "none",
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.07)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
  },
};

const CATEGORY_CONFIG = {
  strength: { label: "Strength", color: "#10b981" },
  cardio: { label: "Cardio", color: "#3b82f6" },
  yoga: { label: "Yoga", color: "#ec4899" },
  mindfulness: { label: "Mindfulness", color: "#8b5cf6" },
};

const UserDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fullName = localStorage.getItem("fullName") ?? "Happy";
  const [classList, setClassList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("strength");
  const [loading, setLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationError, setNotificationError] = useState(null);
  const [bookedIds, setBookedIds] = useState(new Set());
  const [bookingId, setBookingId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [notificationData, setNotificationData] = useState(null);

  const categories = useMemo(
    () =>
      Object.entries(CATEGORY_CONFIG).map(([value, { label }]) => ({
        label,
        value,
      })),
    [],
  );

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setNotificationLoading(true);
        const response = await UserService.notificationsService();
        setNotificationData(response?.data ?? null);
        setNotificationError(null);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotificationError("Failed to load plan");
      } finally {
        setNotificationLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const days = notificationData?.data?.daysRemaining ?? 5;
  const planType = notificationData?.data?.planType ?? "FREE_TRIAL";

  // Fetch booked classes
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
        if (b?.id && (b?.booked === true || typeof b?.booked === "undefined")) {
          initiallyBooked.add(b.id);
        }
      });
      setBookedIds(initiallyBooked);
      setError(null);
    } catch (err) {
      console.error("Error fetching booked classes:", err);
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookedClasses();
  }, [fetchBookedClasses]);

  // Utility functions
  const formatTimeToAMPM = useCallback((time) => {
    if (!time) return "TBA";
    const [hours, minutes] = ("" + time).split(":");
    const hour = parseInt(hours, 10);
    if (Number.isNaN(hour)) return time;
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes || "00"} ${ampm}`;
  }, []);

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const getCategoryColor = useCallback(
    (category) =>
      CATEGORY_CONFIG[(category || "").toString().toLowerCase()]?.color ||
      THEME.colors.text.secondary,
    [],
  );

  // Fetch classes by category
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response =
          await UserService.fetchExerciseCategory(selectedCategory);
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
        setError("Failed to load classes");
        setClassList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [selectedCategory, formatTimeToAMPM]);

  const handleJoinClass = useCallback((cls) => {
    const url = cls?.joinUrl;
    if (!url) {
      alert("Join link not available");
      return;
    }
    try {
      window.open(new URL(url).href, "_blank");
    } catch (err) {
      alert("Invalid join link");
    }
  }, []);

  const handleBookClass = useCallback(
    async (cls) => {
      if (!cls?.id) return;
      setBookingId(cls.id);
      try {
        const response = await UserService.bookClasses(cls.id);
        if (response?.data?.code === "BOOKED") {
          setBookedIds((prev) => new Set(prev).add(cls.id));
          await fetchBookedClasses();
        }
        alert(`${response?.data?.code}\n${response?.data?.message}`);
      } catch (err) {
        alert(`Failed to book: ${err?.message || err}`);
      } finally {
        setBookingId(null);
      }
    },
    [fetchBookedClasses],
  );

  const handleRenewPlan = useCallback(() => {
    console.log("Renew plan");
  }, []);

  const stats = [
    {
      key: "booked",
      Icon: EventAvailableIcon,
      label: "Classes",
      value: totalBookings,
      color: THEME.colors.status.success,
    },
    {
      key: "hours",
      Icon: ScheduleIcon,
      label: "Hours",
      value: "0",
      color: THEME.colors.status.info,
    },
    {
      key: "goal",
      Icon: FlagIcon,
      label: "Goal",
      value: "0/5",
      color: THEME.colors.accent,
    },
  ];

  const renderClassButton = (cls) => {
    const accent = getCategoryColor(cls.category);
    const isBooked = bookedIds.has(cls.id);
    const isCurrentlyBooking = bookingId === cls.id;

    if (isBooked) {
      return cls.joinUrl ? (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleJoinClass(cls)}
          disabled={bookingId !== null && bookingId !== cls.id}
          sx={{
            borderColor: accent,
            color: accent,
            fontWeight: 600,
            fontSize: { xs: 12, md: 13 },
            textTransform: "none",
            borderRadius: THEME.borderRadius,
            "&:hover": {
              borderColor: accent,
              backgroundColor: `${accent}08`,
            },
          }}
        >
          Join
        </Button>
      ) : (
        <Chip label="Booked" variant="outlined" size="small" />
      );
    }

    return (
      <Button
        variant="contained"
        size="small"
        onClick={() => handleBookClass(cls)}
        disabled={bookingId !== null && bookingId !== cls.id}
        sx={{
          background: accent,
          color: "#fff",
          fontWeight: 600,
          fontSize: { xs: 12, md: 13 },
          textTransform: "none",
          borderRadius: THEME.borderRadius,
          "&:hover": {
            background: accent,
            opacity: 0.9,
          },
        }}
      >
        {isCurrentlyBooking ? "..." : "Book"}
      </Button>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: THEME.colors.surface,
        py: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth="md" disableGutters sx={{ px: { xs: 2, md: 0 } }}>
        {/* WELCOME */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            color={THEME.colors.text.primary}
            mb={0.5}
          >
            Welcome back, {fullName}
          </Typography>
          <Typography
            variant="body2"
            color={THEME.colors.text.secondary}
            mb={2}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Typography>

          {notificationError && (
            <Alert
              severity="warning"
              sx={{ mb: 2, borderRadius: THEME.borderRadius }}
              icon={false}
            >
              {notificationError}
            </Alert>
          )}

          {notificationLoading ? (
            <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Card
              sx={{
                background: THEME.colors.background,
                border: `1px solid ${THEME.colors.border}`,
                borderRadius: THEME.borderRadius,
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color={THEME.colors.text.secondary}
                    display="block"
                  >
                    Plan Status
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color={THEME.colors.text.primary}
                  >
                    {days} days remaining
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    flex: { xs: "1 1 100%", sm: "0 1 auto" },
                  }}
                >
                  <Chip
                    label={planType.replace(/_/g, " ")}
                    size="small"
                    variant="outlined"
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleRenewPlan}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: THEME.borderRadius,
                    }}
                  >
                    Renew
                  </Button>
                </Box>
              </Box>
            </Card>
          )}
        </Box>

        {/* CAROUSEL */}
        <Box sx={{ mb: 4 }}>
          {bookings.length > 0 ? (
            <Box
              sx={{
                borderRadius: THEME.borderRadius,
                overflow: "hidden",
                boxShadow: THEME.shadow.md,
              }}
            >
              <CarouselStructure
                bookings={bookings}
                loading={loading}
                fetchBookedClasses={fetchBookedClasses}
              />
            </Box>
          ) : (
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                background: THEME.colors.background,
                border: `1px dashed ${THEME.colors.border}`,
                borderRadius: THEME.borderRadius,
              }}
            >
              <EventAvailableIcon
                sx={{ fontSize: 32, color: THEME.colors.text.light, mb: 1 }}
              />
              <Typography variant="body2" color={THEME.colors.text.secondary}>
                No bookings yet. Start your fitness journey.
              </Typography>
            </Card>
          )}
        </Box>

        {/* STATS */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            color={THEME.colors.text.primary}
            mb={2}
          >
            Progress
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {stats.map(({ key, Icon, label, value, color }) => (
              <Card
                key={key}
                sx={{
                  background: THEME.colors.background,
                  border: `1px solid ${THEME.colors.border}`,
                  borderRadius: THEME.borderRadius,
                  p: 2,
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: THEME.shadow.md,
                    borderColor: color,
                  },
                }}
              >
                <Icon sx={{ fontSize: 28, color, mb: 1 }} />
                <Typography
                  variant="caption"
                  color={THEME.colors.text.secondary}
                  display="block"
                  mb={0.5}
                >
                  {label}
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color={THEME.colors.text.primary}
                >
                  {value}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        {/* LIVE CLASSES */}
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color={THEME.colors.text.primary}
            mb={2}
          >
            Classes
          </Typography>

          {/* Category Tabs */}
          <Box
            sx={{ display: "flex", gap: 1, mb: 3, overflowX: "auto", pb: 1 }}
          >
            {categories.map((cat) => (
              <Button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                sx={{
                  textTransform: "none",
                  fontWeight: selectedCategory === cat.value ? 700 : 500,
                  fontSize: 13,
                  color:
                    selectedCategory === cat.value
                      ? "#fff"
                      : THEME.colors.text.secondary,
                  background:
                    selectedCategory === cat.value
                      ? CATEGORY_CONFIG[cat.value].color
                      : "transparent",
                  border:
                    selectedCategory === cat.value
                      ? "none"
                      : `1px solid ${THEME.colors.border}`,
                  borderRadius: THEME.borderRadius,
                  px: 2,
                  py: 0.75,
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background:
                      selectedCategory === cat.value
                        ? CATEGORY_CONFIG[cat.value].color
                        : THEME.colors.surface,
                  },
                }}
              >
                {cat.label}
              </Button>
            ))}
          </Box>

          {/* Loading */}
          {loading && (
            <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={36} />
            </Box>
          )}

          {/* Error */}
          {error && !loading && (
            <Alert
              severity="error"
              sx={{ borderRadius: THEME.borderRadius }}
              icon={false}
            >
              {error}
            </Alert>
          )}

          {/* Empty */}
          {!loading && !error && classList.length === 0 && (
            <Card
              sx={{
                p: 4,
                textAlign: "center",
                background: THEME.colors.background,
                border: `1px dashed ${THEME.colors.border}`,
                borderRadius: THEME.borderRadius,
              }}
            >
              <ScheduleIcon
                sx={{ fontSize: 36, color: THEME.colors.text.light, mb: 1 }}
              />
              <Typography variant="body2" color={THEME.colors.text.secondary}>
                No {selectedCategory} classes available
              </Typography>
            </Card>
          )}

          {/* Classes */}
          {!loading && !error && classList.length > 0 && (
            <Box sx={{ display: "grid", gap: 2 }}>
              {classList.map((cls) => {
                const accent = getCategoryColor(cls.category);
                return (
                  <Card
                    key={cls.id}
                    sx={{
                      background: THEME.colors.background,
                      border: `1px solid ${THEME.colors.border}`,
                      borderRadius: THEME.borderRadius,
                      p: 2,
                      "&:hover": {
                        boxShadow: THEME.shadow.md,
                        borderColor: accent,
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                      }}
                    >
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: accent,
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            {formatDate(cls.date)}
                          </Typography>
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ my: 0.5 }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: accent,
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            {cls.time}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color={THEME.colors.text.primary}
                          mb={0.5}
                        >
                          {cls.className}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={THEME.colors.text.secondary}
                        >
                          {cls.trainerName} • {cls.duration}
                        </Typography>
                      </Box>
                      <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                        {renderClassButton(cls)}
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>

        {/* PT SESSIONS */}
        <Box sx={{ mt: 4 }}>
          <Ptsession onEnquire={() => console.log("Enquire clicked")} />
        </Box>
      </Container>
    </Box>
  );
};

export default UserDashboard;
