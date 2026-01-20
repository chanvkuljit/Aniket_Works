import React, { useState, useEffect, useRef } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { AdminService } from "../services";
import Carousel from 'react-bootstrap/Carousel';
import AIChatBot from "./AIChatBot";

const FadeIn = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const currentRef = domRef.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setIsVisible(entry.isIntersecting));
    });
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const [classSchedule, setClassSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [activeSafetyStep, setActiveSafetyStep] = useState(0);

  // unchanged behavior: global event to open login
  const openLogin = () => window.dispatchEvent(new CustomEvent("openLogin"));

  const formatTimeToAMPM = (time) => {
    if (!time) return "TBA";
    const [hour] = time.split(":");
    let hrs = parseInt(hour, 10);
    const suffix = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12; // Convert 0 or 12 to 12
    return `${hrs} ${suffix}`;
  };

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    const timer = setTimeout(() => window.scrollTo(0, 0), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await AdminService.fetchWeeklyClassSchedule();
        if (response.data && response.data.success) {
          const scheduleData = response.data.data || [];
          const transformedData = scheduleData.map((classItem) => {
            const dateObj = new Date(classItem.date);
            const dayName = dateObj.toLocaleDateString("en-US", {
              weekday: "long",
            });
            return {
              id: classItem.id,
              day: dayName,
              time: formatTimeToAMPM(classItem.startTime),
              class: classItem.className,
              instructor: classItem.trainerName,
              joinUrl: classItem.joinUrl,
            };
          });
          setClassSchedule(transformedData);
        } else {
          console.error("Invalid API response structure");
          setClassSchedule([]);
        }
      } catch (error) {
        console.error("Error fetching class schedule:", error);
        setClassSchedule([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  // color palette & design tokens (CREATIVE GREEN THEME)
  const pastelHero = "#ecfdf5"; // Fresh Mint background
  const brandGreen = "#059669"; // Rich Emerald Green
  const darkGreen = "#064e3b"; // Deep Forest Green
  const cardShadow = "0 20px 40px -10px rgba(5, 150, 105, 0.15)"; // Green shadow
  const cardBorderBottom = "6px solid rgba(5, 150, 105, 0.2)"; // Green border
  const softBorder = "rgba(5, 150, 105, 0.1)";

  // Common card style for 3D look
  const cardSx = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: 4,
    border: "1px solid rgba(255,255,255,0.5)",
    borderBottom: cardBorderBottom,
    boxShadow: cardShadow,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: "#fff",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 30px 60px -12px rgba(5, 150, 105, 0.25)",
      borderColor: brandGreen,
    },
  };

  const sectionHeadingSx = {
    fontFamily: "'Rubik', sans-serif",
    fontWeight: 800,
    color: "#0f172a",
    fontSize: { xs: "2rem", md: "2.5rem" },
    mb: 2,
    textAlign: "center",
  };

  const joinButtonSx = {
    background: brandGreen,
    color: "#fff",
    px: 4,
    py: 1.5,
    borderRadius: 50,
    textTransform: "none",
    fontWeight: 700,
    fontSize: "1rem",
    boxShadow: "0 10px 20px rgba(5, 150, 105, 0.2)",
    "&:hover": {
      background: "#047857",
      transform: "translateY(-2px)",
      boxShadow: "0 15px 30px rgba(5, 150, 105, 0.3)",
    },
  };

  const colWidths = "25% 20% 35% 20%";

  const classesData = [
    {
      title: "Ignite",
      desc: "A balanced session that gently elevates your heart rate while strengthening your core.",
      image: "/assets/ignite.png",
      bestFor: "Everyday fitness & posture",
      pace: "Moderate, steady",
      feeling: "Warm, strong",
    },
    {
      title: "HIIT",
      desc: "A thoughtfully structured high-intensity session designed for progress—not burnout.",
      image: "/assets/HIIT.jpg",
      bestFor: "Stamina & metabolic fitness",
      pace: "Moderate to challenging",
      feeling: "Energized",
    },
    {
      title: "Power Yoga",
      desc: "A strong, flowing yoga practice that builds strength, balance, and focus.",
      image: "/assets/Power Yoga.jpg",
      bestFor: "Strength, flexibility",
      pace: "Moderate",
      feeling: "Grounded, steady",
    },
    {
      title: "Stretch Yoga",
      desc: "A slow, calming practice focused on improving flexibility and easing everyday stiffness.",
      image: "/assets/stretch.png",
      bestFor: "Improving flexibility",
      pace: "Slow and gentle",
      feeling: "Relaxed, open",
    },
    {
      title: "Reset & Breath",
      desc: "A deeply restorative session focused on breathwork and gentle movement.",
      image: "/assets/reset.png",
      bestFor: "Stress relief, recovery",
      pace: "Very gentle",
      feeling: "Calm, centered",
    },
  ];

  return (
    <>
      <style>
        {`
          .slick-list {
            padding-top: 20px !important;
            padding-bottom: 20px !important;
          }
          @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.4); }
            70% { box-shadow: 0 0 0 14px rgba(5, 150, 105, 0); }
            100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0); }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      {/* HERO SECTION */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: `radial-gradient(circle at 50% 50%, #fff 0%, ${pastelHero} 100%)`,
          pt: { xs: 8, md: 18 },
          pb: { xs: 8, md: 16 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {/* Animated Background Blobs */}
        <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', bgcolor: 'rgba(5, 150, 105, 0.08)', borderRadius: '50%', filter: 'blur(100px)', animation: 'float 10s ease-in-out infinite' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px', bgcolor: 'rgba(5, 150, 105, 0.12)', borderRadius: '50%', filter: 'blur(120px)', animation: 'float 12s ease-in-out infinite reverse' }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <FadeIn>
            <Typography
              component="h1"
              sx={{
                fontFamily: "'Rubik', sans-serif",
                fontSize: { xs: "2rem", md: "2.75rem" },
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.1,
                mb: 3,
                letterSpacing: '-0.01em',
              }}
            >
              Feel safe. Get strong. <br />
              <Box component="span" sx={{ color: brandGreen }}>
                Stay motivated.
              </Box>
            </Typography>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Typography
              variant="h5"
              sx={{
                color: "#475569",
                mb: 5,
                fontWeight: 400,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
                fontSize: { xs: '0.95rem', md: '1.15rem' },
              }}
            >
              Guided live sessions focused on Safety, Consistency, and long-term progress.
            </Typography>
          </FadeIn>

          <FadeIn delay={0.4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <Button
                variant="contained"
                onClick={openLogin}
                sx={{
                  ...joinButtonSx,
                  px: 5,
                  py: 1.8,
                  fontSize: "1rem",
                  borderRadius: '50px',
                  boxShadow: `0 10px 20px -5px rgba(5, 150, 105, 0.4)`,
                  border: '1px solid rgba(255,255,255,0.2)',
                  "&:hover": {
                    background: "#047857",
                    transform: "translateY(-2px)",
                    boxShadow: `0 15px 30px -5px rgba(5, 150, 105, 0.5)`,
                  },
                }}
              >
                Start with confidence
              </Button>
              <Typography variant="caption" sx={{ color: "#64748b", mt: 1.5, fontSize: "0.85rem", fontWeight: 500 }}>
                7 days Free Trial
              </Typography>
            </Box>
          </FadeIn>
        </Container>
      </Box>

      {/* WHY REALIGN WORKS */}
      <Box component="section" sx={{ py: { xs: 10, md: 14 }, background: `radial-gradient(circle at 50% 50%, #fff 0%, ${pastelHero} 100%)`, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '10%', left: '-5%', width: '300px', height: '300px', bgcolor: 'rgba(5, 150, 105, 0.05)', borderRadius: '50%', filter: 'blur(80px)', animation: 'float 10s ease-in-out infinite' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px', bgcolor: 'rgba(5, 150, 105, 0.08)', borderRadius: '50%', filter: 'blur(100px)', animation: 'float 12s ease-in-out infinite reverse' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <Box textAlign="center" mb={10}>
              <Typography variant="overline" color={brandGreen} fontWeight={800} letterSpacing={2}>
                WHY REALIGN WORKS
              </Typography>
              <Typography sx={{ ...sectionHeadingSx, fontSize: { xs: "1.75rem", md: "2.25rem" }, maxWidth: '800px', mx: 'auto', mt: 1 }}>
                Fitness that respects your body and your life
              </Typography>
            </Box>
          </FadeIn>

          <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 8 }}>
            {[
              {
                title: "Safety first",
                desc: "Build strength, stamina, flexibility, and mindfulness through guided, structured movement."
              },
              {
                title: "Consistency over intensity",
                desc: "Progress comes from showing up regularly, not from exhausting workouts."
              },
              {
                title: "Guided & human",
                desc: "Live instructors adapt movement, pace, and cues — not prerecorded routines."
              }
            ].map((item, i, arr) => {
              const isActive = activeStep === i;
              const isLast = i === arr.length - 1;

              return (
                <Box
                  key={i}
                  onMouseEnter={() => setActiveStep(i)}
                  sx={{
                    display: 'flex',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mr: 4,
                      minWidth: 40
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: isActive ? '#059669' : '#e2e8f0',
                        color: isActive ? '#fff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        zIndex: 2,
                        boxShadow: isActive ? '0 0 0 4px rgba(5, 150, 105, 0.2)' : 'none'
                      }}
                    >
                      {i + 1}
                    </Box>

                    {!isLast && (
                      <Box
                        sx={{
                          width: '2px',
                          flexGrow: 1,
                          bgcolor: '#e2e8f0',
                          minHeight: isActive ? 60 : 30,
                          mt: -0.5,
                          mb: -0.5,
                          zIndex: 1
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ pb: isLast ? 0 : 5, flex: 1, pt: 0.5 }}>
                    <Typography
                      variant="h5"
                      fontWeight={isActive ? 700 : 500}
                      color={isActive ? "#0f172a" : "#64748b"}
                      sx={{
                        lineHeight: 1.2,
                        mb: isActive ? 2 : 0,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Box
                      sx={{
                        height: isActive ? 'auto' : 0,
                        overflow: 'hidden',
                        display: isActive ? 'block' : 'none'
                      }}
                    >
                      <Typography variant="body1" color="#475569" lineHeight={1.6} mb={3}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* HOW IT WORKS */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: pastelHero }}>
        <Container maxWidth="lg">
          <Typography sx={sectionHeadingSx}>
            A simple, supportive way to build fitness
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
              gap: 3,
              mt: 6,
            }}
          >
            {[
              { step: "01", title: "Choose a session", desc: "Browse live classes across strength, stamina, flexibility, and mindfulness." },
              { step: "02", title: "Join live", desc: "Train in real time with a qualified instructor who demonstrates form and offers clear guidance." },
              { step: "03", title: "Move at your pace", desc: "You're encouraged to listen to your body. Options are always available." },
              { step: "04", title: "Stay consistent", desc: "With regular practice, fitness becomes easier to maintain and confidence builds naturally." }
            ].map((item, i) => (
              <Box key={i} sx={{ position: "relative" }}>
                <Card sx={{ ...cardSx, position: "relative", zIndex: 1, backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.4)", boxShadow: "none", "&:hover": { transform: "translateY(-4px)" } }}>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} color="#0f172a" gutterBottom sx={{ mt: 4 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="#64748b" lineHeight={1.6}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
          <Typography textAlign="center" mt={6} color={brandGreen} fontWeight={600} fontSize="1.1rem">
            ReAlign helps you build a fitness habit — not survive a workout.
          </Typography>
        </Container>
      </Box>

      {/* DESIGNED TO HELP YOU STAY CONSISTENT */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, background: `radial-gradient(circle at 50% 50%, #fff 0%, ${pastelHero} 100%)`, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '10%', left: '-5%', width: '300px', height: '300px', bgcolor: 'rgba(5, 150, 105, 0.05)', borderRadius: '50%', filter: 'blur(80px)', animation: 'float 9s ease-in-out infinite' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px', bgcolor: 'rgba(5, 150, 105, 0.08)', borderRadius: '50%', filter: 'blur(100px)', animation: 'float 11s ease-in-out infinite reverse' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <Box textAlign="center" mb={10}>
              <Typography sx={sectionHeadingSx}>
                Consistency isn't willpower. It's design.
              </Typography>
            </Box>
          </FadeIn>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>

            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: 35,
                left: '15%',
                right: '15%',
                height: '3px',
                background: brandGreen,
                zIndex: 0,
                opacity: 0.2
              }}
            />

            {[
              {
                step: "01",
                title: "Predictable routines",
                desc: "Familiar session structures remove confusion and decision fatigue.",
              },
              {
                step: "02",
                title: "Realistic scheduling",
                desc: "Multiple session timings fit into real workdays and home routines.",
              },
              {
                step: "03",
                title: "Live human guidance",
                desc: "Training live creates gentle accountability and motivation.",
              }
            ].map((item, index) => (
              <Box key={index} sx={{ width: { xs: '100%', md: '30%' }, position: 'relative', zIndex: 1, textAlign: 'center', mb: { xs: 6, md: 0 } }}>

                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    bgcolor: '#fff',
                    border: `3px solid ${brandGreen}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    animation: 'pulse-green 3s infinite',
                    color: brandGreen,
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
                  }}
                >
                  <Typography variant="h5" fontWeight={800}>{item.step}</Typography>
                </Box>

                <Typography variant="h6" fontWeight={800} color="#0f172a" gutterBottom>
                  {item.title}
                </Typography>
                <Typography color="#64748b" lineHeight={1.6}>
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box textAlign="center" mt={8}>
            <Typography variant="h6" color={brandGreen} fontStyle="italic" mb={4}>
              "Consistency comes from removing friction, not adding force."
            </Typography>
            <Button onClick={openLogin} sx={joinButtonSx}>
              Start with confidence
            </Button>
          </Box>
        </Container>
      </Box>

      {/* DESIGNED WITH SAFETY AT THE CORE */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, background: `radial-gradient(circle at 50% 50%, #fff 0%, ${pastelHero} 100%)`, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '5%', left: '-5%', width: '300px', height: '300px', bgcolor: 'rgba(5, 150, 105, 0.05)', borderRadius: '50%', filter: 'blur(80px)', animation: 'float 10s ease-in-out infinite' }} />
        <Box sx={{ position: 'absolute', bottom: '5%', right: '-5%', width: '400px', height: '400px', bgcolor: 'rgba(5, 150, 105, 0.08)', borderRadius: '50%', filter: 'blur(100px)', animation: 'float 12s ease-in-out infinite reverse' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={6} alignItems="center">

            <FadeIn>
              <Box textAlign="center" maxWidth="800px">
                <Typography variant="overline" display="block" color="#64748b" fontWeight={800} letterSpacing={1} mb={2}>
                  DESIGNED WITH SAFETY AT THE CORE
                </Typography>
                <Typography sx={{ ...sectionHeadingSx, mb: 4, lineHeight: 1.2 }}>
                  A safer way to train — every day
                </Typography>

                <Box sx={{
                  p: 3,
                  borderLeft: `6px solid ${brandGreen}`,
                  bgcolor: "rgba(255,255,255,0.6)",
                  backdropFilter: 'blur(10px)',
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
                  display: 'inline-block',
                  textAlign: 'left',
                  maxWidth: '600px'
                }}>
                  <Typography variant="h6" color="#0f172a" fontWeight={600} fontStyle="italic" lineHeight={1.6}>
                    "Safety isn't about doing less. It's about doing what's right for your body."
                  </Typography>
                </Box>
              </Box>
            </FadeIn>

            <Box maxWidth="600px" width="100%">
              <Stack spacing={0}>
                {[
                  { title: "Guided movement", desc: "Instructors demonstrate form, alignment, and control in every session." },
                  { title: "Progressive intensity", desc: "Sessions build gradually, avoiding sudden spikes in load or pace." },
                  { title: "Options for every body", desc: "Easier and harder variations are always available — you choose what feels right." },
                  { title: "Recovery is respected", desc: "Mobility, rest, and breathwork are part of the program, not afterthoughts." }
                ].map((item, i, arr) => {
                  const isActive = activeSafetyStep === i;
                  const isLast = i === arr.length - 1;

                  return (
                    <Box
                      key={i}
                      onMouseEnter={() => setActiveSafetyStep(i)}
                      sx={{
                        display: 'flex',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          mr: 3,
                          minWidth: 40
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: isActive ? brandGreen : '#cbd5e1',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            zIndex: 2,
                            transition: 'background-color 0.3s'
                          }}
                        >
                          {i + 1}
                        </Box>

                        {!isLast && (
                          <Box
                            sx={{
                              width: '2px',
                              flexGrow: 1,
                              bgcolor: '#e2e8f0',
                              minHeight: isActive ? 40 : 20,
                              mt: -0.5,
                              mb: -0.5,
                              zIndex: 1
                            }}
                          />
                        )}
                      </Box>

                      <Box sx={{ pb: isLast ? 0 : 3, flex: 1 }}>
                        <Typography
                          variant="h6"
                          fontWeight={isActive ? 800 : 600}
                          color={isActive ? "#0f172a" : "#64748b"}
                          sx={{
                            lineHeight: 1.2,
                            pt: 0.5,
                            mb: isActive ? 1 : 0,
                            transition: 'color 0.3s'
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Box
                          sx={{
                            height: isActive ? 'auto' : 0,
                            overflow: 'hidden',
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? 'translateY(0)' : 'translateY(-10px)',
                            transition: 'height 0.3s ease, opacity 0.3s ease, transform 0.3s ease'
                          }}
                        >
                          <Typography variant="body1" color="#64748b" lineHeight={1.6}>
                            {item.desc}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* POPULAR CLASSES (AUTO CAROUSEL) */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, background: `radial-gradient(circle at 50% 50%, #fff 0%, ${pastelHero} 100%)`, overflow: 'hidden', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', bgcolor: 'rgba(5, 150, 105, 0.05)', borderRadius: '50%', filter: 'blur(80px)', animation: 'float 9s ease-in-out infinite' }} />
        <Box sx={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', bgcolor: 'rgba(5, 150, 105, 0.06)', borderRadius: '50%', filter: 'blur(100px)', animation: 'float 11s ease-in-out infinite reverse' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <Typography sx={sectionHeadingSx} mb={1}>
              Popular Classes
            </Typography>
            <Typography textAlign="center" color="#64748b" mb={8} maxWidth="700px" mx="auto">
              Experience our most loved sessions.
            </Typography>
          </FadeIn>

          <Box sx={{ mx: -2, px: 2 }}>
            <Carousel data-bs-theme="dark" interval={5000} fade>
              {classesData.map((cls, index) => (
                <Carousel.Item key={index}>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 6,
                      overflow: 'hidden',
                      height: { xs: 350, md: 500 },
                      bgcolor: '#f1f5f9',
                      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Box
                      component="img"
                      className="d-block w-100"
                      src={cls.image}
                      alt={cls.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0.7)'
                      }}
                    />

                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        color: '#fff',
                        width: '100%',
                        px: 2,
                        zIndex: 10
                      }}
                    >
                      <Typography
                        variant="h2"
                        component="div"
                        fontWeight={900}
                        sx={{
                          textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          fontSize: { xs: '2.5rem', md: '4rem' },
                          letterSpacing: '-0.02em'
                        }}
                      >
                        {cls.title}
                      </Typography>
                    </Box>
                  </Box>

                  <Carousel.Caption>
                    <Box sx={{ pb: { xs: 2, md: 4 } }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {cls.title} Session
                      </Typography>
                      <Stack direction="row" spacing={2} justifyContent="center" mt={1} sx={{ opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        <Typography variant="body2" sx={{ color: '#fff' }}>{cls.desc}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={2} justifyContent="center" mt={1} sx={{ opacity: 0.8, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        <Typography variant="caption" sx={{ color: '#fff' }}>Start: {formatTimeToAMPM(cls.time)}</Typography>
                        <Typography variant="caption" sx={{ color: '#fff' }}>•</Typography>
                        <Typography variant="caption" sx={{ color: '#fff' }}>{cls.pace}</Typography>
                      </Stack>
                    </Box>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Box>
        </Container>
      </Box>

      {/* SCHEDULE */}
      <Box component="section" sx={{ pb: { xs: 6, md: 10 }, background: `radial-gradient(circle at 50% 50%, #fff 0%, ${pastelHero} 100%)` }}>
        <Container maxWidth="lg">
          <FadeIn>
            <Box textAlign="center" mb={5}>
              <Typography sx={sectionHeadingSx}>
                Weekly Class Schedule
              </Typography>
            </Box>
          </FadeIn>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="240px">
              <CircularProgress size={56} sx={{ color: brandGreen }} />
              <Typography variant="h6" sx={{ ml: 2, color: "#64748b" }}>
                Loading schedule...
              </Typography>
            </Box>
          ) : (
            <Card sx={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${softBorder}`, boxShadow: cardShadow }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: colWidths,
                  bgcolor: pastelHero,
                  py: 2,
                  px: { xs: 2, md: 4 },
                  borderBottom: `2px solid ${softBorder}`,
                }}
              >
                {["Day", "Time", "Class", "Join"].map((h, i) => (
                  <Typography key={i} fontWeight={800} color={darkGreen} fontSize={{ xs: "0.9rem", md: "1.1rem" }} textAlign={h === "Join" ? "center" : "left"}>
                    {h}
                  </Typography>
                ))}
              </Box>

              <Box>
                {classSchedule.length === 0 ? (
                  <Box textAlign="center" py={12}>
                    <Typography color="#475569" fontSize="1.1rem">
                      No classes scheduled for this week.
                    </Typography>
                  </Box>
                ) : (
                  classSchedule.map((row, index) => (
                    <Box
                      key={row.id || index}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: colWidths,
                        alignItems: "center",
                        p: { xs: 2, md: 4 },
                        borderBottom: index !== classSchedule.length - 1 ? `1px solid ${softBorder}` : "none",
                        bgcolor: index % 2 === 0 ? "#ffffff" : "#FAFAFA",
                        transition: "background 0.2s",
                        "&:hover": { bgcolor: pastelHero },
                      }}
                    >
                      <Typography fontWeight={600} color="#0f172a">{row.day}</Typography>
                      <Typography color="#64748b">{row.time}</Typography>
                      <Typography fontWeight={600} color="#0f172a">{row.class}</Typography>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          variant="contained"
                          onClick={openLogin}
                          size="small"
                          sx={{
                            ...joinButtonSx,
                            py: 0.8,
                            px: 3,
                            fontSize: "0.9rem",
                            boxShadow: "none",
                            width: "auto"
                          }}
                        >
                          Join
                        </Button>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Card>
          )}
        </Container>
      </Box>

      {/* TESTIMONIALS */}
      <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: pastelHero }}>
        <Container maxWidth="lg">
          <Typography sx={sectionHeadingSx} mb={6}>What Our Members Say</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4 }}>
            {[
              { name: "Rita Patel, 68", role: "Retired Teacher", text: "Chair yoga has reduced my pain and helped me stay active — the community is wonderful.", initial: "RP", color: "#16a34a", bg: "#ecfdf5" },
              { name: "Anita Mehta, 42", role: "Working Mom", text: "Short morning classes fit my schedule perfectly — I finally have a routine.", initial: "AM", color: "#2563eb", bg: "#eef2ff" },
              { name: "James Thompson, 55", role: "IT Professional", text: "Evening meditations help me unwind and sleep better — highly recommended.", initial: "JT", color: "#7c3aed", bg: "#f5f3ff" }
            ].map((t, i) => (
              <Card key={i} sx={{ ...cardSx, p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: t.bg, color: t.color, mr: 2, fontWeight: 700 }}>{t.initial}</Avatar>
                  <Box>
                    <Typography fontWeight={800} color="#0f172a">{t.name}</Typography>
                    <Typography variant="body2" color="#64748b">{t.role}</Typography>
                  </Box>
                </Box>
                <Typography variant="body1" color="#334155" sx={{ fontStyle: "italic", mb: 3, lineHeight: 1.6 }}>"{t.text}"</Typography>
                <Typography sx={{ color: "#fbbf24" }}>⭐⭐⭐⭐⭐</Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      <AIChatBot />
    </>
  );
}