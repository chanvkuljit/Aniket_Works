import React from "react";
import { Card, CardContent, Box, Typography, useTheme } from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";

function StreakCard({
  streak = 0,
  goal = 0,
  days = [],
  doneDays = [],
  plannedDays = [],
  statusMsg = '',
  weekSummary = ''
}) {
  const theme = useTheme();
  const weekDays = days.length === 7 ? days : ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        boxShadow: '0 1px 8px #e0e7ef',
        p: 0,
        minHeight: 320,
        width: '100%',
        maxWidth: 370,
        mx: 'auto',
        background: '#fff',
        border: `1.5px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a259ff 0%, #ff6a00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <WhatshotIcon sx={{ color: '#fff', fontSize: 38 }} />
        </Box>
        <Typography variant="h5" fontWeight={800} color="#1a223f" mb={0.5} align="center">
          {streak} Day Streak!
        </Typography>
        <Typography variant="body1" color="#6b7280" fontWeight={500} mb={0.5} align="center">
          {statusMsg}
        </Typography>
        <Typography variant="body2" color="#6b7280" mb={2} align="center">
          {weekSummary}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center' }}>
          {weekDays.map((d, idx) => {
            let color = '#e5e7eb';
            let textColor = '#6b7280';
            let border = 'none';
            if (doneDays.includes(idx)) {
              color = '#22c55e';
              textColor = '#fff';
            } else if (plannedDays.includes(idx)) {
              color = '#fff';
              textColor = '#22c55e';
              border = '2px solid #22c55e';
            }
            return (
              <Box
                key={d + idx}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: color,
                  color: textColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                  border,
                  transition: 'all 0.2s',
                }}
              >
                {d}
              </Box>
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 1, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: '50%', background: '#22c55e', mr: 0.5 }} />
            <Typography variant="caption" color="#6b7280">Done</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #22c55e', background: '#fff', mr: 0.5 }} />
            <Typography variant="caption" color="#6b7280">Planned</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: '50%', background: '#e5e7eb', mr: 0.5 }} />
            <Typography variant="caption" color="#6b7280">Not planned</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StreakCard;
