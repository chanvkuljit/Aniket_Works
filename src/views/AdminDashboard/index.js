// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { AdminService } from "../../services";
import GetALLClassDetails from "./GetALLClassDetails";

const AdminDashboard = () => {
  const [instructors, setInstructors] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [category, setCategory] = useState("");
  const [className, setClassName] = useState("");
  const [date, setDate] = useState("");
  const [timeLive, setTimeLive] = useState("");
  const [durationLive, setDurationLive] = useState("");
  const [loading, setLoading] = useState(false);
  const [zoomUrl, setZoomUrl] = useState("");

  // ✅ Fetch instructors (arrow function inside useEffect)
  useEffect(() => {
    let mounted = true;

    const fetchInstructors = async () => {
      try {
        const res = await AdminService.getAllInstructors();
        const payload = res?.data;
        let list = [];

        if (Array.isArray(payload)) list = payload;
        else if (Array.isArray(payload?.data)) list = payload.data;
        else if (Array.isArray(payload?.data?.data)) list = payload.data.data;

        if (mounted) setInstructors(list);
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to load instructors");
      }
    };

    fetchInstructors();

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ Create Live Class (arrow function)
  const handleCreateLiveClass = async () => {
    setLoading(true);
    try {
      const payload = {
        date,
        startTime: timeLive,
        durationInMinutes: durationLive ? Number(durationLive) : undefined,
        className,
        trainerId: selectedTrainer,
        category,
        joinUrl: zoomUrl,
      };

      const res = await AdminService.createLiveClassSchedule(payload);
      const message = res?.data?.message || "Class created successfully!";
      alert(message);

      // clear form
      setCategory("");
      setClassName("");
      setDate("");
      setTimeLive("");
      setDurationLive("");
      setSelectedTrainer("");
      setZoomUrl("");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to create class";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
   <Box sx={{ maxWidth: 1160, mx: "auto", p: { xs: 2, sm: 4 } }}>
  <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 } }}>
    <Typography
      variant="h5"
      component="h1"
      gutterBottom
      sx={{ fontWeight: 700, mb: 3 }}
    >
      Create Live Classes Schedule
    </Typography>

    {/* ✅ Responsive Grid for all fields */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 2.5, // spacing between fields
        alignItems: "center",
      }}
    >
      {/* Category */}
      <TextField
        select
        fullWidth
        label="Exercise Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        // helperText="Choose a category"
      >
        <MenuItem value="">Select</MenuItem>
        <MenuItem value="YOGA">YOGA</MenuItem>
        <MenuItem value="MINDFULNESS">MINDFULNESS</MenuItem>
        <MenuItem value="STRENGTH">STRENGTH</MenuItem>
        <MenuItem value="CARDIO">CARDIO</MenuItem>
      </TextField>

      {/* Class Name */}
      <TextField
        fullWidth
        label="Class Name"
        placeholder="e.g., Morning Flow"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      {/* Trainer */}
      <TextField
        select
        fullWidth
        label="Trainer"
        value={selectedTrainer}
        onChange={(e) => setSelectedTrainer(e.target.value)}
      >
        <MenuItem value="">Select Trainer</MenuItem>
        {instructors.map((t) => (
          <MenuItem key={t.id ?? t._id ?? t.email} value={t.id ?? t._id ?? t.email}>
            {t.fullName || t.name || t.email}
          </MenuItem>
        ))}
      </TextField>

      {/* Date */}
      <TextField
        fullWidth
        label="Select Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Time */}
      <TextField
        fullWidth
        label="Time (HH:MM:SS)"
        type="time"
        InputLabelProps={{ shrink: true }}
        value={timeLive}
        onChange={(e) => setTimeLive(e.target.value)}
      />

      {/* Duration */}
      <TextField
        fullWidth
        label="Duration (minutes)"
        type="number"
        inputProps={{ min: 0 }}
        value={durationLive}
        onChange={(e) => setDurationLive(e.target.value)}
      />

      {/* Zoom Link */}
      <TextField
        fullWidth
        label="Zoom Link"
        placeholder="https://zoom.us/j/123456789"
        value={zoomUrl}
        onChange={(e) => setZoomUrl(e.target.value)}
      />

      {/* Create Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: { xs: 1, sm: 0 },
        }}
      >
        <Button
          variant="contained"
          type="button"
          sx={{
            px: 3,
            py: 1.3,
            width: { xs: "100%", sm: "auto" },
            fontWeight: 600,
          }}
          disabled={loading}
          onClick={handleCreateLiveClass}
        >
          {loading ? "Creating..." : "CREATE LIVE CLASS"}
        </Button>
      </Box>
    </Box>
  </Paper>
</Box>
<GetALLClassDetails/>
</>

  );
};

export default AdminDashboard;
