// src/components/Popup/Privacy.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PrivacyPopup({ open, onClose }) {
  // theme-free query so it works without ThemeProvider
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      aria-labelledby="privacy-dialog-title"
      scroll="paper"
    >
      <DialogTitle
        id="privacy-dialog-title"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">Privacy Policy</Typography>
          <Typography variant="body2" color="text.secondary">
            Last Updated: 18 Nov. 25
          </Typography>
        </Box>

        <IconButton aria-label="close privacy" onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1">
            This Privacy Policy explains how we collect, use, store, disclose, and protect your personal information when you access or use our website, application, or services (“Services”). By using our platform, you agree to the practices described in this Policy.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            1. Information We Collect
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            1.1 Personal Information Provided by You
            When you create an account, book classes, or communicate with us, we may collect the following details:
            • Full name
            • Email address
            • Phone number
            • Date of birth (optional)
            • Profile information
            • Payment details (processed securely through third-party payment gateways)
            We do not store your complete payment card information.
          </Typography>

          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            1.2 Automatically Collected Information
            When you access the platform, we may collect:
            • Device information (mobile, laptop, OS, browser)
            • IP address and location (approximate)
            • Login times and usage activity
            • Cookies and tracking data
            • Session logs and interaction data
          </Typography>

          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            1.3 Class Participation Information
            During live classes, if you choose to keep your camera ON, you understand that:
            • Trainers can see your video feed in real-time
            • We do not record or store your video feed
            • Other participants cannot see you unless your specific class format allows visibility (we can customize this)
            Audio/video communication happens through secure third-party tools.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            Your information is used to:
            • Create and manage your account
            • Schedule and deliver live classes
            • Provide posture corrections and real-time guidance
            • Process payments and send billing confirmations
            • Track your progress and class history
            • Improve our platform and customer experience
            • Communicate updates, notifications, and support messages
            • Ensure platform safety and prevent misuse
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            3. Sharing of Personal Information
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            We do not sell or rent your personal data.
            We may share your information only with:
            3.1 Service Providers — Trusted third parties who help us operate the platform, such as:
            • Payment processors
            • Video conferencing tools
            • Email/SMS notification services
            • Cloud hosting providers
            • Analytics tools

            These partners are bound by confidentiality and data protection agreements.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            4. Storage & Security
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            We implement reasonable technical and organizational measures to protect your data, including:
            • Encrypted communication (HTTPS/SSL)
            • Limited access controls
            • Secured servers
            • Payment gateway security (PCI-DSS compliant partners)

            Although we strive to protect your data, no online system is completely secure.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            5. Data Retention
          </Typography>
          <Typography variant="body2">
            We retain your information for as long as:
            • Your account remains active
            • Required for providing Services
            • Necessary to comply with legal obligations
            You may request deletion of your account data at any time.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            6. Cookies & Tracking Technologies
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            We use cookies and similar tools to:
            • Maintain login sessions
            • Remember your preferences
            • Improve website performance
            • Analyze usage and trends
            You may disable cookies through browser settings, but certain features may not work properly.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            7. Your Rights
          </Typography>
          <Typography variant="body2">
            Depending on your country/region, you may have the right to:
            • Access your personal data
            • Request corrections
            • Request deletion
            • Withdraw consent
            • Opt-out of marketing communications
            • Request a copy of your data
            For any such requests, you can contact us at the details below.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            8. Children's Privacy
          </Typography>
          <Typography variant="body2">
            Our Services are not intended for individuals under the age of 13.
            We do not knowingly collect personal information from children.
            If we become aware of such data, we will take steps to delete it immediately.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            9. Third-Party Links
          </Typography>
          <Typography variant="body2">
            Our platform may contain links to third-party websites or services.
            We are not responsible for the privacy practices of these external sites.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            10. Changes to This Privacy Policy
          </Typography>
          <Typography variant="body2">
            We may update this Privacy Policy from time to time.
            Changes take effect once posted on our website.
            Your continued use of the Services indicates acceptance of the updated Policy.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            11. Contact Us
          </Typography>
          <Typography variant="body2">
            If you have questions or requests related to this Privacy Policy, please contact:
            <br />
            📩 Email: info@realign.in
            <br />
            📱 Phone: 8983671866
            <br />
            🌐 Website: realign.fit
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

PrivacyPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
