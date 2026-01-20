// src/components/Popup/Terms.jsx
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

export default function TermsPopup({ open, onClose }) {
  // Use a plain CSS media query string to avoid requiring a ThemeProvider.
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      aria-labelledby="terms-dialog-title"
      scroll="paper"
    >
      <DialogTitle
        id="terms-dialog-title"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">Terms of Service</Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: 18 Nov. 25
          </Typography>
        </Box>

        <IconButton aria-label="close terms" onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1">
            Welcome to our Health & Wellness platform. By accessing or using our website, live classes, or services, you agree to the following Terms of Service. Please read them carefully before using the platform.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            By creating an account, booking a class, or accessing any part of the platform, you confirm that you:
            • Are at least 18 years old, or have parental consent
            • Have read and agree to these Terms of Service
            • Accept our Privacy Policy

            If you do not agree, please do not use our services.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            2. Our Services
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            We provide live, online fitness and wellness classes focused on:
            • Flexibility
            • Strength
            • Mobility
            • Stamina
            • Daily movement habit-building

            Classes may be live, interactive, or recorded. We may modify or update the classes, features, or trainers at any time.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            3. User Responsibilities
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            By using the platform, you agree to:
            • Provide accurate information during signup
            • Use your account only for personal, non-commercial purposes
            • Follow class instructions safely and within your ability
            • Keep your login details secure
            • Not record, copy, or redistribute any class content

            Misuse of the platform may result in suspension or termination of your account.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            4. Health Disclaimer
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            Our services are for general wellness and fitness.
            We are not medical professionals.
            By joining classes, you acknowledge that:
            • You are physically and mentally fit to participate
            • You have consulted a doctor if you have any medical condition, injury, or limitation
            • You participate at your own risk

            We are not responsible for injuries or health issues arising during or after sessions.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            5. Camera Usage
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            You may choose to keep your camera ON or OFF during live classes.
            • Camera ON allows trainers to correct posture and offer personalized guidance.
            • Camera OFF provides privacy but reduces feedback quality.
            By keeping the camera ON, you consent to trainers viewing your live video feed.
            We never record or store your video.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            6. Equipment
          </Typography>
          <Typography variant="body2">
            Most classes require no equipment. Some sessions may suggest using a yoga mat, cushion, block, or light dumbbells.
            Equipment requirements will be shown while booking the session.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            7. Payments & Subscriptions
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            • You are required to pay the full amount upfront for the plan you choose.
            • We do not offer monthly subscription billing or auto-renewal at this time.
            • Plan prices may change, and any updates will be communicated clearly before purchase.
            • Successful payment is required to activate and maintain access to your classes and dashboard.

            You are responsible for ensuring successful payments for continued access.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            8. Cancellation & Refund Policy
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            • You may cancel a class any time before it begins.
            • Refunds (full or pro-rata) are subject to the specific plan’s refund rules.
            • No refunds will be issued for missed sessions.

            We reserve the right to refuse refunds in case of policy misuse.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            9. Membership Pause
          </Typography>
          <Typography variant="body2">
            We currently do not offer a membership pause or hold option.
            Please choose a plan duration that suits your schedule.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            10. Class Conduct
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            During live classes, you agree to:
            • Maintain respectful behavior
            • Follow trainer instructions
            • Not disrupt the experience for others

            We may mute, remove, or restrict accounts for inappropriate behavior.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            11. Intellectual Property
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            All content, including:
            • Class videos
            • Program designs
            • Images
            • Website content
            • Branding

            is owned by us and protected by copyright laws.
            You may not copy, record, share, or commercially use any content without written permission.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            12. Account Termination
          </Typography>
          <Typography variant="body2">
            We reserve the right to suspend or terminate accounts that:
            • Violate these Terms
            • Misuse the platform
            • Engage in fraudulent activity

            You may also choose to delete your account at any time.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            13. Limitation of Liability
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: "pre-line" }}>
            To the maximum extent permitted by law, we are not liable for:
            • Injuries, strains, or health issues
            • Internet disruptions or technical issues
            • Losses due to misuse of the platform
            • Third-party service failures

            Your use of the platform is at your own risk.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            14. Changes to Terms
          </Typography>
          <Typography variant="body2">
            We may update these Terms from time to time. Continued use of the platform after updates constitutes acceptance of the revised Terms.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            15. Contact Us
          </Typography>
          <Typography variant="body2">
            For questions or support:
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

TermsPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
