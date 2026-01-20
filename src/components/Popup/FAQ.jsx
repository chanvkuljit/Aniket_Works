// src/components/Popup/FAQ.jsx
import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  useMediaQuery,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";

/*
  Usage:
    import FAQPopup from "src/components/Popup/FAQ";
    const [open, setOpen] = useState(false);
    <FAQPopup open={open} onClose={() => setOpen(false)} />

  Notes:
  - This component uses Material-UI (MUI). Ensure @mui/material and @mui/icons-material are installed.
  - The FAQ content is embedded below. Edit the `faqs` array to update questions/answers.
*/

const faqs = [
  {
    q: "What is this platform about?",
    a: `We are India’s first habit-driven online fitness platform focused on improving flexibility, strength, stamina, and daily movement through live instructor-led classes you can do from home. Our goal is to help you build consistency—not just complete workouts.`,
  },
  {
    q: "Do I need any equipment?",
    a: `Most of our classes require no equipment at all — you can start with just your body weight.
Some sessions may recommend using:
• A yoga mat
• A cushion or block
• Light dumbbells (optional)

When booking a class, you’ll always see if any equipment is suggested.`,
  },
  {
    q: "How do live classes work?",
    a: `After signing up, you can book any live class from your dashboard.
You’ll join a Zoom-like interface where trainers guide you in real time, correcting posture and motivating you throughout.`,
  },
  {
    q: "What if I am a beginner or not flexible?",
    a: `Trainers provide modified versions of every movement, so you can improve safely at your own pace.`,
  },
  {
    q: "How many classes can I attend per week?",
    a: `You can book unlimited weekly classes.
We recommend at least 3–5 sessions weekly to build consistent habits.`,
  },
  {
    q: "Can the trainer see me during the class?",
    a: `Yes, trainers can see you only if your camera is ON.
• Camera ON = personalized posture corrections and better guidance
• Camera OFF = privacy mode (you can still attend the class)

We recommend keeping your camera ON so the trainer can correct your form and ensure you’re doing the movements safely and effectively.`,
  },
  {
    q: "What fitness areas do you focus on?",
    a: `Our programs focus on:
• Flexibility
• Strength
• Stamina
• Posture correction
• Mobility
• Fat loss/Weight Loss
• Stress relief through movement & breathwork`,
  },
  {
    q: "Are classes safe for people with injuries?",
    a: `Yes, but we recommend:
• Informing your trainer before class
• Choosing low-impact sessions
• Consulting a doctor if you have severe injuries`,
  },
  {
    q: "How do I cancel or reschedule a class?",
    a: `You can cancel or rebook anytime from your dashboard.`,
  },
  {
    q: "Are trainers certified?",
    a: `All our trainers are qualified in:
• Yoga
• Strength & Conditioning
• Mobility
• Pilates
• Injury-safe movement

We vet every trainer for safety and experience.`,
  },
  {
    q: "How is this different from YouTube workouts?",
    a: `YouTube is passive.
Our platform is personal, guided, habit-centered.
You get:
• Real-time posture correction
• Instructor accountability
• Tracking that keeps you consistent
• A structured weekly routine

That’s the difference between watching workouts vs actually improving.`,
  },
];

export default function FAQPopup({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");


  // Reset search & expansion when closed
  useEffect(() => {
    if (!open) {
      setQuery("");
      setExpanded(false);
    }
  }, [open]);

  const normalized = (s = "") => s.toLowerCase().replace(/\s+/g, " ").trim();

  const filteredFAQs = useMemo(() => {
    const q = normalized(query);
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        normalized(f.q).includes(q) ||
        normalized(f.a).includes(q) ||
        f.q.toLowerCase().includes(q)
    );
  }, [query]);

  const handleAccordionToggle = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="faq-dialog-title"
      scroll="paper"
      fullScreen={isMobile}
    >
      <DialogTitle id="faq-dialog-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">Frequently Asked Questions</Typography>
          <Typography variant="body2" color="text.secondary">
            Quick answers about classes, trainers and how the platform works.
          </Typography>
        </Box>

        <IconButton aria-label="close" onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search FAQs (e.g., equipment, cancel, beginner...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              "aria-label": "Search FAQs",
            }}
          />
        </Box>

        <Box>
          {filteredFAQs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No results for “{query}”. Try different keywords or check back later.
            </Typography>
          ) : (
            filteredFAQs.map((item, idx) => {
              const panelId = `faq-panel-${idx}`;
              return (
                <Accordion
                  key={panelId}
                  expanded={expanded === panelId}
                  onChange={handleAccordionToggle(panelId)}
                  sx={{ mb: 1, "&:before": { display: "none" } }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${panelId}-content`}
                    id={`${panelId}-header`}
                  >
                    <Typography sx={{ fontWeight: 600 }}>{item.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {item.a.split("\n").map((paragraph, i) => (
                      <Typography
                        key={i}
                        paragraph
                        variant="body2"
                        sx={{ whiteSpace: "pre-line" }}
                      >
                        {paragraph}
                      </Typography>
                    ))}
                  </AccordionDetails>
                </Accordion>
              );
            })
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

FAQPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
