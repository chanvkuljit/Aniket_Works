// FooterComponents.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import FAQPopup from "./Popup/FAQ.jsx";
// ADDED: import Terms popup
import TermsPopup from "./Popup/Terms.jsx";
// ADDED: import Privacy popup
import PrivacyPopup from "./Popup/Privacy.jsx";

import { useState, useEffect } from "react";
const FooterComponents = () => {
  const brandGreen = "#059669";
  const pastelHero = "#ecfdf5";

  const linkSx = {
    color: "#475569",
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: 500,
    transition: "color 0.2s",
    "&:hover": {
      color: brandGreen,
      textDecoration: "none",
    },
  };

  const headingSx = {
    color: "#0f172a",
    fontWeight: 800,
    mb: 2.5,
    textTransform: "uppercase",
    fontSize: "0.85rem",
    letterSpacing: "1px"
  };

  const [faqOpen, setFaqOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  useEffect(() => {
    const handleOpenFaq = () => setFaqOpen(true);
    window.addEventListener("openFAQ", handleOpenFaq);
    return () => window.removeEventListener("openFAQ", handleOpenFaq);
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        background: `radial-gradient(circle at 50% 0%, #fff 0%, ${pastelHero} 100%)`,
        color: "#0f172a",
        py: { xs: 8, md: 10 },
        mt: "auto",
        borderTop: "1px solid rgba(5, 150, 105, 0.1)",
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Animated Blobs for "Green Shadows" theme */}
      <Box sx={{ position: 'absolute', bottom: '-50%', left: '-10%', width: '400px', height: '400px', bgcolor: 'rgba(5, 150, 105, 0.05)', borderRadius: '50%', filter: 'blur(80px)' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        <Grid container spacing={8} justifyContent="space-between">

          {/* LEFT — COMPANY INFO */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.5px' }}>
                Re<Box component="span" sx={{ color: brandGreen }}>Align</Box>
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                lineHeight: 1.8,
                maxWidth: 320,
              }}
            >
              Making wellness accessible to everyone, everywhere. Live fitness,
              yoga, and meditation classes for every level.
            </Typography>
          </Grid>

          {/* CENTER — SUPPORT */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'center' } }}>
            <Typography variant="subtitle1" sx={headingSx}>
              Support
            </Typography>

            <Stack spacing={1.5} sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}>
              <Link component="button" sx={linkSx} onClick={() => setFaqOpen(true)} underline="none">FAQ</Link>
              <FAQPopup open={faqOpen} onClose={() => setFaqOpen(false)} />

              <Link component="button" sx={linkSx} onClick={() => setPrivacyOpen(true)} underline="none">Privacy Policy</Link>
              <PrivacyPopup open={privacyOpen} onClose={() => setPrivacyOpen(false)} />

              <Link component="button" sx={linkSx} onClick={() => setTermsOpen(true)} underline="none">Terms of Service</Link>
              <TermsPopup open={termsOpen} onClose={() => setTermsOpen(false)} />
            </Stack>
          </Grid>

          {/* RIGHT — CONNECT */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="subtitle1" sx={headingSx}>
              Connect With Us
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              justifyContent={{ xs: "flex-start", md: "flex-end" }}
              sx={{ mb: 1 }}
            >
              {[TwitterIcon, FacebookIcon, InstagramIcon].map((Icon, i) => (
                <IconButton
                  key={i}
                  sx={{
                    color: brandGreen,
                    bgcolor: 'rgba(5, 150, 105, 0.1)',
                    transition: 'all 0.3s',
                    '&:hover': { bgcolor: brandGreen, color: '#fff', transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' }
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Divider + © */}
        <Box sx={{ mt: 8, pt: 4, borderTop: "1px solid rgba(5, 150, 105, 0.1)", textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            © {new Date().getFullYear()} ReAlign. All rights reserved.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default FooterComponents;
