import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const GOALS = [
  "Weight loss",
  "Flexibility",
  "Stamina",
  "Stress",
  "Mindfulness",
];

const LIFESTYLES = [
  "Sedentary",
  "Moderately active",
  "Very active",
];

const SESSIONS = [
  { label: "3 days", value: 3 },
  { label: "4 days", value: 4 },
  { label: "All days", value: 7 },
];

function generatePlan(primary, sessions) {
  // Only 3 and 4 sessions logic as per your rules
  if (sessions === 3) {
    switch (primary) {
      case "Weight loss":
        return [
          "Stamina & Cardio",
          "Stamina & Cardio",
          "Strength & Core",
          "Rest/Walk",
          "Rest/Walk",
          "Rest/Walk",
          "Rest/Walk",
        ];
      case "Flexibility":
        return [
          "Flexibility & Stretching",
          "Flexibility & Stretching",
          "Mindfulness",
          "Rest/Walk",
          "Rest/Walk",
          "Rest/Walk",
          "Rest/Walk",
        ];
      case "Mindfulness":
        return [
          "Mindfulness",
          "Mindfulness",
          "Flexibility",
          "Rest/Walk",
          "Rest/Walk",
          "Rest/Walk",
          "Rest/Walk",
        ];
      case "Stamina":
        return [
          "Stamina & Cardio",
          "Stamina & Cardio",
          "Strength & Core",
          "Rest/Walk",
          "Rest/Walk",
          "Rest/Walk",
          "Rest/Walk",
        ];
      default:
        return Array(7).fill("Rest/Walk");
    }
  } else if (sessions === 4) {
    switch (primary) {
      case "Weight loss":
        return [
          "Stamina",
          "Stamina",
          "Strength",
          "Flexibility",
          "Rest/Walk",
          "Rest/Walk",
          "Rest/Walk",
        ];
      case "Flexibility":
        return [
          "Flexibility",
          "Flexibility",
          "Flexibility",
          "Mindfulness",
          "Rest/Walk",
          "Rest/Walk",
          "Rest/Walk",
        ];
      case "Mindfulness":
        return [
          "Mindfulness",
          "Mindfulness",
          "Mindfulness",
          "Flexibility",
          "Rest/Walk",
          "Rest/Walk",
          "Rest/Walk",
        ];
      case "Stamina":
        return [
          "Stamina",
          "Stamina",
          "Stamina",
          "Strength",
          "Rest/Walk",
          "Rest/Walk",
          "Rest/Walk",
        ];
      default:
        return Array(7).fill("Rest/Walk");
    }
  } else {
    // All days: just repeat primary goal for all days
    return Array(7).fill(primary);
  }
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PersonalisedPlane = () => {
  const [open, setOpen] = useState(false);
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [secondaryGoal, setSecondaryGoal] = useState("");
  const [healthIssues, setHealthIssues] = useState("");
  const [sessions, setSessions] = useState(3);
  const [lifestyle, setLifestyle] = useState("");
  const [plan, setPlan] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    setPlan(generatePlan(primaryGoal, sessions));
    setOpen(false);
  };

  return (
    <Card sx={{ borderRadius: 4, boxShadow: "0 1px 8px #e0e7ef", mb: 4 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>
            Personalised Plan
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            Generate plan
          </Button>
        </Box>
        {plan ? (
          <Grid container spacing={2}>
            {plan.map((activity, idx) => (
              <Grid item xs={12} sm={6} md={3} key={weekDays[idx]}>
                <Box
                  sx={{
                    background: "#f5f6fa",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                    minHeight: 70,
                  }}
                >
                  <Typography variant="subtitle2" color="#7c3aed" fontWeight={700}>
                    {weekDays[idx]}
                  </Typography>
                  <Typography variant="body1" color="#1a223f" fontWeight={600}>
                    {activity}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary" mt={2}>
            No plan generated yet. Click "Generate plan" to create your weekly plan.
          </Typography>
        )}
      </CardContent>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Generate Personalised Plan</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Primary goal</InputLabel>
            <Select
              value={primaryGoal}
              label="Primary goal"
              onChange={e => setPrimaryGoal(e.target.value)}
            >
              {GOALS.map(goal => (
                <MenuItem key={goal} value={goal}>{goal}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Secondary goal</InputLabel>
            <Select
              value={secondaryGoal}
              label="Secondary goal"
              onChange={e => setSecondaryGoal(e.target.value)}
            >
              {GOALS.map(goal => (
                <MenuItem key={goal} value={goal}>{goal}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Health Issues"
            fullWidth
            margin="normal"
            value={healthIssues}
            onChange={e => setHealthIssues(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Sessions per week</InputLabel>
            <Select
              value={sessions}
              label="Sessions per week"
              onChange={e => setSessions(Number(e.target.value))}
            >
              {SESSIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Life style</InputLabel>
            <Select
              value={lifestyle}
              label="Life style"
              onChange={e => setLifestyle(e.target.value)}
            >
              {LIFESTYLES.map(life => (
                <MenuItem key={life} value={life}>{life}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!primaryGoal || !sessions || !lifestyle}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PersonalisedPlane;