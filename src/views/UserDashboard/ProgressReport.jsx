import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Typography, Paper, Grid } from '@mui/material';

const metrics = [
  { label: 'Strength', value: 50, color: '#22c55e' },
  { label: 'Flexibility', value: 50, color: '#8b5cf6' },
  { label: 'Stamina', value: 50, color: '#2563eb' },
  { label: 'Mindfulness', value: 50, color: '#ec4899' },
];

const getChartOptions = (color) => ({
  chart: { type: 'radialBar', sparkline: { enabled: true } },
  plotOptions: {
    radialBar: {
      hollow: { size: '60%' },
      track: { background: '#e5e7eb', strokeWidth: '100%' },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: '28px',
          fontWeight: 700,
          color: '#222',
          offsetY: 6,
          formatter: (val) => `${val}%`,
        },
      },
      startAngle: -120,
      endAngle: 120,
      fill: { type: 'solid' },
      stroke: { lineCap: 'butt' },
    },
  },
  colors: [color],
  labels: [''],
  grid: { padding: { top: 0, bottom: 0 } },
});

const ProgressReport = () => {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, background: '#fff', width: '100%', mx: 'auto', mb: 4 }}>
      <Typography variant="h6" fontWeight={700} color="#1a223f" mb={3}>
        Fitness Progress
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {metrics.map((m) => (
          <Grid item xs={6} sm={3} key={m.label} sx={{ textAlign: 'center' }}>
            <Box sx={{ width: 140, mx: 'auto' }}>
              <ReactApexChart
                type="radialBar"
                height={140}
                width={140}
                options={getChartOptions(m.color)}
                series={[m.value]}
              />
            </Box>
            <Typography variant="subtitle1" fontWeight={600} color="#1a223f" mt={1}>
              {m.label}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ProgressReport;
