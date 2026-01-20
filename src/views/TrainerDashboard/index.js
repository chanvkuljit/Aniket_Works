import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Box,
  Paper,
  Typography,
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
} from "@mui/material";
import ConfirmDialog from "../../components/ConfirmDialog";
// import { Navigate, useNavigate } from "react-router-dom";
// import { URLS } from "../../urls";
import { TrainerService } from "../../services";

const TrainerDashboard = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  // const navigate = useNavigate();
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalDaysWorked = 2;
  const totalSessionTaken = 1;
  
  // Get current date in YYYY-MM-DD format
  const getCurrentDateFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d
      .toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      })
      .replace(",", "");
  });

  const [selectedDate, setSelectedDate] = useState(dates[0]);

  // Function to convert display date to API format (YYYY-MM-DD)
  const formatDateForAPI = (displayDate) => {
    // Parse the display date (e.g., "Thu 14 Nov")
    const d = new Date(today);
    const dateIndex = dates.indexOf(displayDate);
    d.setDate(today.getDate() + dateIndex);
    
    // Format as YYYY-MM-DD
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Fetch data by date
  const fetchClassData = async (displayDate) => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedDate = formatDateForAPI(displayDate);
      console.log("Fetching data for date:", formattedDate); // Debug log
      
      // Call your API function here
      const response = await TrainerService.fetchDataByDate(formattedDate);
      
      console.log("API Response:", response); // Debug log
      
      let data = [];
      if (response.data) {
        // If response has a data property
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data.classes && Array.isArray(response.data.classes)) {
          data = response.data.classes;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        }
      } else if (Array.isArray(response)) {
        // If response itself is an array
        data = response;
      }
      
      setClassData(data);
    } catch (err) {
      console.error("Error fetching class data:", err);
      setError("Failed to load class data");
      setClassData([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial page load with current date
  useEffect(() => {
    const currentDate = dates[0]; // Get today's date
    console.log("Initial load - fetching data for:", formatDateForAPI(currentDate));
    fetchClassData(currentDate);
  }, []); // Empty dependency array - runs only once on mount

  const handleSwitchChange = () => {
    setConfirmOpen(true);
  };

  const handleClose = () => {
    setConfirmOpen(false);
  };

  // const handleConfirm = () => {
  //   setConfirmOpen(false);
  //   navigate(URLS.HOME);
  // };

  const handleDateClick = (date) => {
    console.log("Date clicked:", date, "API format:", formatDateForAPI(date));
    setSelectedDate(date);
    fetchClassData(date); // Fetch data when date is clicked
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" color="primary" sx={{ flex: 1 }}>
          Trainer Dashboard
        </Typography>
        <Switch color="primary" onChange={handleSwitchChange} />
        <ConfirmDialog
          open={confirmOpen}
          handleClose={handleClose}
          dialogTitle="Confirm to switch"
          dialogContent="Are you sure you want to switch to user dashboard?"
          cancelBtnText="cancel"
          confirmBtnText="confirm"
          // onConfirm={handleConfirm}
        />
      </Box>

      <Box sx={{ display: "flex", mb: 2, gap: 2 }}>
        <TextField
          disabled
          id="outlined-disabled"
          defaultValue={`Total Days Worked : ${totalDaysWorked}`}
        />
        <TextField
          disabled
          id="outlined-disabled"
          defaultValue={`Total Session Taken : ${totalSessionTaken}`}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        {dates.map((date, idx) => (
          <Box
            key={idx}
            component="button"
            onClick={() => handleDateClick(date)}
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              color: "#222",
              boxShadow: 3,
              textAlign: "center",
              minWidth: 100,
              border: "none",
              outline: "none",
              cursor: "pointer",
              fontWeight: 400,
              transition: "box-shadow 0.2s, background 0.2s",
              "&:hover": {
                background: "#e3e8ff",
                boxShadow: 6,
              },
              background: selectedDate === date ? "#e3e8ff" : "#f5f6fa",
            }}
          >
            {date}
          </Box>
        ))}
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Class Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Bookings</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Join</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : !Array.isArray(classData) || classData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" style={{ color: "#888" }}>
                  No classes
                </TableCell>
              </TableRow>
            ) : (
              classData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.bookings}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() =>
                        window.open(row.joinUrl, "_blank", "noopener")
                      }
                    >
                      Join
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TrainerDashboard;