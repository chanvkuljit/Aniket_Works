import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Paper,
  Box,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MultipleSelect from "./MultipleSelect";

const Members = () => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [editingRows, setEditingRows] = useState([]); // Rows in edit mode
  const [editValues, setEditValues] = useState({});
  const [selectedRole, setSelectedRole] = useState("ALL");

  /** --- Handle edit mode toggle --- */
  const handleEditClick = (rowId) => {
    setEditingRows((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      if (current.includes(rowId)) {
        return current.filter((id) => id !== rowId);
      } else {
        return [...current, rowId];
      }
    });
  };

  /** --- Normalize backend response --- */
  const normalizeUsers = (data, page, size) => {
    const list =
      data?.data?.content ||
      data?.data ||
      data?.content ||
      data?.users ||
      data?.items ||
      [];

    const totalCount =
      data?.data?.totalElements ||
      data?.totalElements ||
      data?.total ||
      data?.count ||
      list.length;

    return {
      list: list.map((item, i) => ({
        id: item.id || item._id || i + page * size,
        fullName:
          item.fullName || `${item.firstName || ""} ${item.lastName || ""}`.trim(),
        email: item.email || "",
        mobile: item.mobile || item.phone || item.phoneNumber || "",
        role: Array.isArray(item.roles) ? item.roles.join(", ") : item.role || "",
      })),
      total: totalCount,
    };
  };

  /** --- Fetch users with pagination --- */
  const fetchUsers = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.realign.fit/api/users?page=${page}&size=${size}`);
      const data = await res.json();
      const { list, total } = normalizeUsers(data, page, size);
      setRows(list);
      setTotal(total);
    } catch (err) {
      console.error("Fetch failed:", err);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(pagination.page, pagination.pageSize);
  }, [fetchUsers, pagination.page, pagination.pageSize]);

  /** --- Pagination handler --- */
  const handlePageChange = (model) => {
    setPagination(model);
  };

  /** --- Filter by role --- */
  const handleSearch = async () => {
    if (selectedRole === "ALL") {
      fetchUsers(pagination.page, pagination.pageSize);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.realign.fit/api/users/filter/role/${selectedRole.toLowerCase()}`
      );
      const data = await res.json();
      const { list, total } = normalizeUsers(data, 0, 10);
      setRows(list);
      setTotal(total);
    } catch (err) {
      console.error("Filter failed:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  /** --- Handle input change for editable rows --- */
  const handleEditChange = (id, field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  /** --- Commit update for selected row --- */
  const handleUpdate = async (row) => {
    const updates = editValues[row.id];
    if (!updates || Object.keys(updates).length === 0) {
      return alert("No changes detected!");
    }

    setLoading(true);
    try {
      // Transform data to match backend expectations
      const payload = {};
      
      // Map frontend fields to backend fields
      if (updates.fullName !== undefined) payload.fullName = updates.fullName;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.mobile !== undefined) payload.phone = updates.mobile; // mobile → phone
      if (updates.role !== undefined) {
        // Convert role string to roles array
        const roleValue = updates.role.trim().toUpperCase();
        payload.roles = [roleValue]; // role → roles (array)
      }

      console.log("Sending payload:", payload); // Debug log

      const response = await fetch(`https://api.realign.fit/api/users/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Backend response:", result); // Debug log

      // Update local state with the response data
      if (result.data) {
        setRows((prev) =>
          prev.map((r) => {
            if (r.id === row.id) {
              return {
                ...r,
                fullName: result.data.fullName || r.fullName,
                email: result.data.email || r.email,
                mobile: result.data.phone || r.mobile,
                role: Array.isArray(result.data.roles) 
                  ? result.data.roles.join(", ") 
                  : r.role,
              };
            }
            return r;
          })
        );
      }

      // Clear edit state
      setEditValues((prev) => {
        const newValues = { ...prev };
        delete newValues[row.id];
        return newValues;
      });

      // Remove from editing mode
      setEditingRows((prev) => {
        const current = Array.isArray(prev) ? prev : [];
        return current.filter((id) => id !== row.id);
      });

      alert("Record updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert(`Update failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /** --- Cancel edit mode --- */
  const handleCancelEdit = (rowId) => {
    setEditingRows((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      return current.filter((id) => id !== rowId);
    });
    setEditValues((prev) => {
      const newValues = { ...prev };
      delete newValues[rowId];
      return newValues;
    });
  };

  /** --- Columns --- */
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    ...["fullName", "email", "mobile", "role"].map((field) => ({
      field,
      headerName:
        field === "fullName"
          ? "Full Name"
          : field[0].toUpperCase() + field.slice(1),
      flex: 1,
      renderCell: (params) => {
        const row = params.row;
        const isEditing = Array.isArray(editingRows) && editingRows.includes(row.id);
        const currentValue = editValues[row.id]?.[field] ?? params.value ?? "";

        return isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={currentValue}
            onChange={(e) => handleEditChange(row.id, field, e.target.value)}
          />
        ) : (
          params.value
        );
      },
    })),
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => {
        const row = params.row;
        const isEditing = Array.isArray(editingRows) && editingRows.includes(row.id);
        
        return isEditing ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => handleUpdate(row)}
            >
              Update
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleCancelEdit(row.id)}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleEditClick(row.id)}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <MultipleSelect onChange={setSelectedRole} />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>

      <Paper sx={{ height: 500, width: "100%", position: "relative" }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              background: "rgba(255,255,255,0.6)",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <DataGrid
          rows={rows}
          columns={columns}
          paginationMode="server"
          rowCount={total}
          paginationModel={pagination}
          onPaginationModelChange={handlePageChange}
          pageSizeOptions={[10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
};

export default Members;