import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
// import "../styles/Navbar.css";
import RegisterDialog from "./RegisterDialog";
import { LoginService } from "../services";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { URLS } from "../urls";
import { useToast } from "../hooks/useToast";

function Navbar() {
  const [showModal, setShowModal] = React.useState(false);
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [identifier, setIdentifier] = React.useState(""); // email or mobile
  const [otp, setOtp] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  React.useEffect(() => {
    // listen for global "openLogin" events (dispatched from Home or anywhere)
    const onOpenLogin = () => setShowModal(true);
    window.addEventListener("openLogin", onOpenLogin);
    return () => window.removeEventListener("openLogin", onOpenLogin);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginButton = (e) => {
    e && e.preventDefault();
    setShowModal(true);
    handleMenuClose();
    console.log("Login button clicked");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIdentifier("");
    setOtp("");
    setOtpSent(false);
    setSending(false);
  };

  const handleOpenRegisterFromLogin = () => {
    // close login modal and open register dialog
    handleCloseModal();
    setRegisterOpen(true);
  };

  const handleSendOtp = () => {
    if (!identifier.trim()) {
      // console.log("Provide email or mobile");
      toast.error("Please provide email or mobile number");
      return;
    }
    sendOtp();
  };

  const handleVerifyOtp = () => {
    verifyOtp();
  };

  const sendOtp = async () => {
    setSending(true);
    try {
      const response = await LoginService.requestOtpLogin({
        email: identifier,
      });
      console.log(771, response);
      if (response.status === 200 && response.data.success) {
        setOtpSent(true);
        // alert("OTP sent successfully to " + identifier);
        toast.success("OTP sent successfully to " + identifier);
      } else {
        // alert("Failed to send OTP. Please try again");
        toast.error("Failed to send OTP. Please try again");
      }
    } catch (error) {
      console.log(888, error);
      const resData = error.response?.data;

      if (error.status === 404 && resData?.code === "NOT_FOUND") {
        toast.error(
          resData.message ||
          "User not found. Please create an account first."
        );
      } else if (resData?.code === "BAD_REQUEST" && resData?.data) {
        const validationMsgs = Object.entries(resData.data)
          .map(([field, msg]) => `${field} ${msg}`)
          .join(". ");
        toast.error(validationMsgs);
      } else {
        const errorMessage =
          resData?.message ||
          error.message ||
          "An error occurred. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    setSending(true);
    try {
      const response = await LoginService.verifyOtpLogin({
        email: identifier,
        otp,
      });
      if (response.status === 200 && response.data.success) {
        const { data } = response.data;
        localStorage.setItem("token", data.accessToken);
        getCurrentUserProfile();
      } else {
        // alert("An error occurred. Please try again");
        toast.error("An error occurred. Please try again");
      }
    } catch (error) {
      console.log("Verify OTP Error:", error);
      const resData = error.response?.data;

      if (
        error.status === 401 &&
        resData?.code === "UNAUTHORIZED"
      ) {
        const errorMessage =
          resData.message || "Invalid OTP. Please try again";
        toast.error(errorMessage);
        setOtp("");
      } else if (resData?.code === "BAD_REQUEST" && resData?.data) {
        const validationMsgs = Object.entries(resData.data)
          .map(([field, msg]) => `${field} ${msg}`)
          .join(". ");
        toast.error(validationMsgs);
      } else {
        const errorMessage =
          resData?.message ||
          error.message ||
          "An error occurred. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setSending(false);
    }
  };

  const getCurrentUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // alert("No token found. Please login again.");
        toast.error("No token found. Please login again.");
        setOtp("");
        setOtpSent(false);
        return;
      }
      const response = await LoginService.getCurrentUserProfile();
      if (
        response.status === 200 &&
        response.data.success &&
        response.data.code === "PROFILE"
      ) {
        const { data } = response.data;
        localStorage.setItem("roles", JSON.stringify(data.roles));
        localStorage.setItem("user", data.email);
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("mobile", data.phone);
        localStorage.setItem("mobile", data.phone);
        // alert("Login Successful");
        toast.success("Login Successful");
        if (data.roles.includes("USER")) {
          navigate(URLS.USERS);
        } else if (data.roles.includes("ADMIN")) {
          navigate(URLS.ADMIN);
        } else {
          navigate(URLS.TRAINERS_DASHBOARD);
        }
      } else {
        // alert("Failed to fetch user profile");
        toast.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.log(222, error);
    }
  };

  const handleOpenLogin = () => {
    setShowModal(true);
  };

  // color tokens (only visuals)
  const brandGreen = "#10b981";
  const navText = "#0f172a"; // dark navy for text/icons
  const navBg = "#f0fdf7"; // navbar background
  const navShadow = "0 1px 6px rgba(15,23,42,0.06)";

  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          background: navBg, // white background
          color: navText,
          boxShadow: navShadow,
          borderBottom: "1px solid rgba(15,23,42,0.04)",
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: 2,
            }}
          >
            <Typography
              component="span"
              aria-hidden="true"
              sx={{ fontSize: 20 }}
            >
              🧘
            </Typography>
            <Typography
              component="span"
              variant="h6"
              // className="brand-name"
              sx={{ fontWeight: 700, color: navText }}
            >
              ReAlign
            </Typography>
          </Box>

          {/* Desktop: show CTA button */}
          {!isMobile && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginButton}
              id="loginId"
              sx={{
                background: brandGreen,
                color: "#fff",
                border: "none",
                textTransform: "none",
                px: 3,
                py: 1.1,
                fontWeight: 600,
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                boxShadow: "0 10px 26px rgba(16,185,129,0.12)",
                "&:hover": {
                  background: "#0ea56f",
                },
              }}
            >
              Login / Join
            </Button>
          )}

          {/* Mobile: show hamburger that opens a small menu */}
          {isMobile && (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
                size="large"
                sx={{ color: navText }}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    minWidth: 160,
                    p: 0.5,
                    bgcolor: navBg,
                    color: navText,
                    boxShadow: navShadow,
                  },
                }}
              >
                <MenuItem onClick={handleLoginButton} sx={{ color: navText }}>
                  Login / Join
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Login Modal (Dialog) */}
      <Dialog
        open={showModal}
        fullWidth
        maxWidth="xs"
        // fullScreen={isMobile}
        aria-labelledby="login-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          id="login-dialog-title"
          sx={{ fontWeight: 700, color: navText }}
        >
          Login
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 2, py: 3 }}
        >
          {/* filled input: email or mobile */}
          <TextField
            variant="outlined"
            label="Email"
            placeholder=""
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              // If email changes, reset OTP state so user must send OTP again
              if (otpSent) {
                setOtpSent(false);
                setOtp("");
              }
            }}
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
            }}
            autoComplete="email"
            size="small"
          />

          {/* filled input: OTP */}
          <TextField
            variant="outlined"
            label="OTP"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              setOtp(val);
            }}
            fullWidth
            disabled={!otpSent}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              htmlInput: {
                maxLength: 6,
              },
            }}
            size="small"
          />
          <Link
            sx={{
              textDecoration: "none",
              cursor: "pointer",
              fontSize: 14,
              color: brandGreen,
            }}
            onClick={handleOpenRegisterFromLogin}
          >
            Don't have an account? Sign Up
          </Link>
        </DialogContent>

        {/* DialogActions: left = register link, right = actions */}
        <DialogActions
          sx={{
            px: 2,
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              color="inherit"
              sx={{
                borderColor: "rgba(15,23,42,0.08)",
                color: navText,
                textTransform: "none",
              }}
            >
              Close
            </Button>

            {!otpSent ? (
              <Button
                variant="contained"
                onClick={handleSendOtp}
                disabled={sending || !identifier.trim()}
                sx={{
                  background: brandGreen,
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": { background: "#0ea56f" },
                }}
              >
                {sending ? "Sending…" : "Send OTP"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleVerifyOtp}
                disabled={!otp.trim() || sending}
                sx={{
                  background: brandGreen,
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": { background: "#0ea56f" },
                }}
              >
                {sending ? "Verifying…" : "Verify"}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Register dialog (separate component) */}
      <RegisterDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onOpenLogin={handleOpenLogin}
      />
    </>
  );
}

export default Navbar;
