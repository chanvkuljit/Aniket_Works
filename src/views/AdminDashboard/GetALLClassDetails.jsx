import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { AdminService } from "../../services";

const GetALLClassDetails = () => {
  const [classes, setClasses] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingUpdateId, setPendingUpdateId] = useState(null);
  const [editedData, setEditedData] = useState({});

  // Fetch classes function (moved outside useEffect to reuse)
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await AdminService.fetchAllTheClasses();
      console.log(111, response);
      console.log("Full Response:", response);
      console.log("Response.data:", response.data);
      console.log("Response.data.data:", response.data.data);
      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        setClasses(response.data.data);
        console.log("Classes set successfully:", response.data.data.length);
      } else {
        console.error("Unexpected response structure:", response);
        setError("Invalid response format");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch classes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  // Pagination
  const paginatedClasses = classes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setEditingRowId(null);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setEditingRowId(null);
  };

  // Handle edit click - enter edit mode
  const handleEditClick = (id) => {
    setEditingRowId(id);
    // Store the original class data before editing
    const classToEdit = classes.find((c) => c.id === id);
    if (classToEdit) {
      setEditedData((prev) => ({
        ...prev,
        [id]: { ...classToEdit },
      }));
    }
  };

  // Handle save click - show confirmation dialog
  const handleSaveClick = (id) => {
    setPendingUpdateId(id);
    setShowConfirmDialog(true);
  };

  // Handle cancel button in dialog - exit edit mode
  const handleCancelUpdate = () => {
    setShowConfirmDialog(false);
    setPendingUpdateId(null);
    // Exit edit mode
    setEditingRowId(null);
    // Clear edited data for this row
    if (pendingUpdateId) {
      setEditedData((prev) => {
        const newData = { ...prev };
        delete newData[pendingUpdateId];
        return newData;
      });
    }
  };

  // Handle confirm button in dialog - update the class
  const handleConfirmUpdate = async () => {
    setShowConfirmDialog(false);

    if (!pendingUpdateId) return;

    try {
      // Get the edited data for this class
      const updatedFields = editedData[pendingUpdateId];

      if (!updatedFields) {
        alert("No changes to save");
        setEditingRowId(null);
        return;
      }

      // Show loading state
      setLoading(true);

      // Call the API to update - pass ID as param and updated data in body
      const response = await AdminService.updateExistingClasses(
        pendingUpdateId,
        updatedFields
      );

      console.log("Update response:", response);

      // Refresh the entire list to get updated data from server
      await fetchClasses();

      // Exit edit mode
      setEditingRowId(null);

      // Clear edited data
      setEditedData((prev) => {
        const newData = { ...prev };
        delete newData[pendingUpdateId];
        return newData;
      });

      // Show success message
      alert("Class updated successfully!");
    } catch (error) {
      console.error("Error updating class:", error);
      alert(
        "Failed to update class: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
      setPendingUpdateId(null);
    }
  };

  // Handle field changes - update editedData state
  const handleCellChange = (id, key, value) => {
    setEditedData((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [key]: value,
      },
    }));
  };

  // Render status chip with colors
  const renderStatusChip = (status) => {
    const statusUpper = (status || "").toUpperCase();
    const colorMap = {
      COMPLETED: { bg: "#ef5350", text: "#fff" },
      UPCOMING: { bg: "#66bb6a", text: "#fff" },
      CANCELLED: { bg: "#ffa726", text: "#fff" },
    };
    const colors = colorMap[statusUpper] || { bg: "#bdbdbd", text: "#000" };

    return (
      <Chip
        label={statusUpper || "-"}
        size="small"
        sx={{
          backgroundColor: colors.bg,
          color: colors.text,
          fontWeight: 600,
          height: 26,
        }}
      />
    );
  };

  // Render editable cell based on type
  const renderEditableCell = (classItem, field, type = "text") => {
    const isEditing = editingRowId === classItem.id;
    // Get value from editedData if editing, otherwise from classItem
    const value =
      isEditing && editedData[classItem.id]?.[field] !== undefined
        ? editedData[classItem.id][field]
        : classItem[field] ?? "";

    if (!isEditing) {
      return (
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "-"}
        </Typography>
      );
    }

    if (type === "select-category") {
      return (
        <TextField
          select
          size="small"
          fullWidth
          value={value}
          onChange={(e) =>
            handleCellChange(classItem.id, field, e.target.value)
          }
        >
          <MenuItem value="YOGA">YOGA</MenuItem>
          <MenuItem value="MINDFULNESS">MINDFULNESS</MenuItem>
          <MenuItem value="STRENGTH">STRENGTH</MenuItem>
          <MenuItem value="CARDIO">CARDIO</MenuItem>
        </TextField>
      );
    }

    if (type === "select-status") {
      return (
        <TextField
          select
          size="small"
          fullWidth
          value={value}
          onChange={(e) =>
            handleCellChange(classItem.id, field, e.target.value)
          }
        >
          <MenuItem value="UPCOMING">UPCOMING</MenuItem>
          <MenuItem value="COMPLETED">COMPLETED</MenuItem>
          <MenuItem value="CANCELLED">CANCELLED</MenuItem>
        </TextField>
      );
    }

    return (
      <TextField
        size="small"
        fullWidth
        type={type}
        value={value}
        onChange={(e) => handleCellChange(classItem.id, field, e.target.value)}
        InputLabelProps={
          type === "date" || type === "time" ? { shrink: true } : undefined
        }
      />
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Existing Classes
      </Typography>

      <Paper elevation={4}>
        <TableContainer sx={{ borderRadius: 2, position: "relative" }}>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255,255,255,0.7)",
                zIndex: 10,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          <Table
            stickyHeader
            size="small"
            sx={{
              minWidth: 900,
              "& .MuiTableHead-root .MuiTableCell-root": {
                bgcolor: "#f5f5f5",
                color: "text.secondary",
                fontWeight: 600,
                fontSize: 13,
              },
              "& .MuiTableCell-root": {
                paddingY: 1.5,
                paddingX: 2,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 180 }}>Trainer Name</TableCell>
                <TableCell sx={{ width: 140 }}>Category</TableCell>
                <TableCell>Class Name</TableCell>
                <TableCell sx={{ width: 120 }}>Date</TableCell>
                <TableCell sx={{ width: 100 }}>Time</TableCell>
                <TableCell sx={{ width: 110 }}>Duration (mins)</TableCell>
                <TableCell sx={{ width: 110 }}>Status</TableCell>
                <TableCell sx={{ width: 250 }}>Join URL</TableCell>
                <TableCell align="center" sx={{ width: 80 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{ color: "error.main", py: 4 }}
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : paginatedClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    No classes found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedClasses.map((classItem) => {
                  const isEditing = editingRowId === classItem.id;
                  const status = (classItem.status || "").toUpperCase();
                  const hoverColor =
                    status === "COMPLETED"
                      ? "rgba(255, 0, 0, 0.08)"
                      : status === "UPCOMING"
                      ? "rgba(0, 128, 0, 0.08)"
                      : "rgba(0, 0, 0, 0.04)";

                  return (
                    <TableRow
                      key={classItem.id}
                      hover
                      sx={{
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: hoverColor,
                        },
                      }}
                    >
                      <TableCell>
                        {isEditing ? (
                          <TextField
                            size="small"
                            fullWidth
                            disabled
                            value={classItem.trainerName}
                          />
                        ) : (
                          <Typography variant="body2">
                            {classItem.trainerName}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        {renderEditableCell(
                          classItem,
                          "category",
                          "select-category"
                        )}
                      </TableCell>

                      <TableCell>
                        {renderEditableCell(classItem, "className")}
                      </TableCell>

                      <TableCell>
                        {renderEditableCell(classItem, "date", "date")}
                      </TableCell>

                      <TableCell>
                        {renderEditableCell(classItem, "startTime", "time")}
                      </TableCell>

                      <TableCell>
                        {renderEditableCell(
                          classItem,
                          "durationInMinutes",
                          "number"
                        )}
                      </TableCell>

                      <TableCell>
                        {isEditing
                          ? renderEditableCell(
                              classItem,
                              "status",
                              "select-status"
                            )
                          : renderStatusChip(classItem.status)}
                      </TableCell>

                      <TableCell>
                        {isEditing ? (
                          renderEditableCell(classItem, "joinUrl")
                        ) : (
                          <a
                            href={classItem.joinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#1976d2",
                              textDecoration: "none",
                              fontSize: "0.875rem",
                            }}
                          >
                            {classItem.joinUrl}
                          </a>
                        )}
                      </TableCell>

                      <TableCell align="center">
                        {isEditing ? (
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleSaveClick(classItem.id)}
                          >
                            <SaveIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            color="default"
                            size="small"
                            onClick={() => handleEditClick(classItem.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={classes.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelUpdate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to update this class? The changes will be
            saved permanently.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdate} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmUpdate}
            color="primary"
            variant="contained"
            autoFocus
          >
            Yes, Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GetALLClassDetails;