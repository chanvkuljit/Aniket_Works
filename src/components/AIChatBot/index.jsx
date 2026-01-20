import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Fab,
    CircularProgress,
    Avatar,
    Button,
    Stack,
    Chip 
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

// --- CONFIGURATION ---
const HEALTH_QUESTIONS = [
    { key: "name", text: "What is your name?" },
    { key: "age", text: "How old are you? (Min age 18)", type: "number" }, // Specification Added
    {
        key: "gender",
        text: "What is your gender?",
        type: "select",
        options: ["Male", "Female", "Prefer not to say"]
    },
    { key: "height", text: "What is your height (in cm)?", type: "number" },
    { key: "weight", text: "What is your weight (in kg)?", type: "number" },
    {
        key: "working_status",
        text: "What best describes your current working status?",
        type: "select",
        options: ["Working Professional", "Homemaker", "Student", "Retired", "Others"]
    },
    {
        key: "lifestyle",
        text: "How would you describe your daily lifestyle?",
        type: "select",
        options: ["Sedentary", "Active", "Others"]
    },
    {
        key: "goals",
        text: "What are your fitness goals?",
        type: "multi-select",
        options: ["Weight Loss", "Stamina", "Strength", "Flexibility", "Mindfulness", "General Health"]
    },
    {
        key: "health_issues",
        text: "Do you have any of the following health concerns?",
        type: "multi-select",
        options: ["Thyroid - Hypothyroid", "Thyroid - Hyperthyroid", "Diabetes", "High BP", "Low BP", "Migraine", "PCOS / PCOD", "Digestive Issues", "Poor Sleep", "High Stress", "None", "Others"]
    }
];

// --- REPORT COMPONENT ---
const HealthReport = ({ res }) => (
    <Box sx={{ p: 0.5 }}>
        <Typography variant="subtitle2" sx={{ color: "#10b981", fontWeight: 700, mb: 1.5, borderBottom: "2px solid #10b981", pb: 0.5, display: "inline-block" }}>
            SUGGESTIONS
        </Typography>
        <Stack spacing={2}>
            <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b", display: "block", mb: 0.5 }}>WORKOUT STRATEGY</Typography>
                <Typography variant="body2" fontWeight={500}>{res.final_recommendation.join(", ")}</Typography>
                <Typography variant="caption" color="text.secondary">{res.duration} | {res.frequency}</Typography>
            </Box>
            <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b", display: "block", mb: 0.5 }}>NUTRITIONAL GUIDANCE</Typography>
                <Typography variant="body2" sx={{ fontSize: "0.85rem", lineHeight: 1.4 }}>{res.diet_recommendations}</Typography>
            </Box>
            {res.blocked_workouts?.length > 0 && (
                <Box sx={{ bgcolor: "#fff1f2", p: 1, borderRadius: 1, borderLeft: "4px solid #e11d48" }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#e11d48", display: "block" }}>SAFETY RESTRICTIONS</Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>{res.blocked_workouts.join(", ")} are restricted based on your health profile.</Typography>
                </Box>
            )}
            <Box sx={{ bgcolor: "#f8fafc", p: 1.5, borderRadius: 2, border: "1px dashed #cbd5e1" }}>
                <Typography variant="body2" sx={{ fontStyle: "italic", fontSize: "0.85rem", color: "#334155" }}>
                    "{res.reasoning}"
                </Typography>
            </Box>
        </Stack>
    </Box>
);

export default function AIChatBot() {
    const [open, setOpen] = useState(true);
    const [mode, setMode] = useState("select");
    const [healthStep, setHealthStep] = useState(0);
    const [healthData, setHealthData] = useState({});
    const [messages, setMessages] = useState([
        {
            text: (
                <span>
                    Hi, I’m your ReAlign Wellness Assistant.
                    <br /><br />
                    I can help you with questions related to ReAlign’s workouts and health guidance.
                    <br /><br />
                    For personalised health, diet, and workout guidance, click <b>Health Advice</b> below.
                </span>
            ),
            sender: "bot",
            isSystem: true,
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const threadIdRef = useRef("session_" + new Date().toISOString());

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, open]);

    const selectMode = (selectedMode) => {
        if (selectedMode === "health") {
            setMode("health");
            setHealthStep(0);
            setHealthData({});
            setMessages(prev => [...prev, { text: "I can help with that. First, " + HEALTH_QUESTIONS[0].text, sender: "bot" }]);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, sender: "user" }]);
        setInput("");

        if (mode === "chat" || mode === "health-result") {
            await handleGenericChat(userMsg);
        } else if (mode === "health") {
            await handleHealthCollection(userMsg);
        } else if (mode === "select") {
            setMessages(prev => [...prev, { text: "Please select an option above to continue.", sender: "bot" }]);
        }
    };

    const handleGenericChat = async (query) => {
        setLoading(true);
        try {
            const response = await fetch("https://ai-api.realign.fit/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: query, thread_id: threadIdRef.current }),
            });
            const data = await response.json();
            setMessages(prev => [...prev, { text: data.response || "I didn't quite get that.", sender: "bot" }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Error reaching server.", sender: "bot", isError: true }]);
        } finally {
            setLoading(false);
        }
    };

    const handleHealthCollection = async (answer) => {
    const currentQ = HEALTH_QUESTIONS[healthStep];
    let val = answer;

    // 1. Validation Logic
    if (currentQ.key === "age") {
        const ageNum = parseFloat(answer);
        if (isNaN(ageNum) || ageNum < 18) {
            // AGER AGE 18 SE KAM HAI TOH YEHI STOP KARDO
            setMessages(prev => [...prev, { 
                text: "❌ Access Denied: You must be at least 18 years old to use this service.", 
                sender: "bot", 
                isError: true 
            }]);
            return; // Yeh 'return' agle step par jaane se rok dega
        }
        val = ageNum;
    } else if (["weight", "height"].includes(currentQ.key)) {
        val = parseFloat(answer);
        if (isNaN(val) || val <= 0) {
            setMessages(prev => [...prev, { text: `Please enter a valid ${currentQ.key}.`, sender: "bot", isError: true }]);
            return;
        }
    }

        if (currentQ.key === "gender") {
            const normalized = answer.toLowerCase();
            if (normalized.includes("female")) val = "female";
            else if (normalized.includes("male")) val = "male";
            else val = "other";
        }

        if (["health_issues", "goals"].includes(currentQ.key)) {
            val = val.toLowerCase() === "none" ? [] : answer.split(",").map(s => s.trim()).filter(s => s);
        }

        const updatedData = { ...healthData, [currentQ.key]: val };
        setHealthData(updatedData);

        if (healthStep < HEALTH_QUESTIONS.length - 1) {
            setHealthStep(prev => prev + 1);
            const nextQ = HEALTH_QUESTIONS[healthStep + 1];
            setTimeout(() => {
                setMessages(prev => [...prev, { text: nextQ.text, sender: "bot" }]);
            }, 300);
        } else {
            setMode("health-result");
            await submitHealthAdvice(updatedData);
        }
    };

    const submitHealthAdvice = async (data) => {
        setLoading(true);
        try {
            const response = await fetch("https://ai-api.realign.fit/health-advice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const res = await response.json();
            setMessages(prev => [...prev, { text: <HealthReport res={res} />, sender: "bot" }]);
            setMode("chat");
        } catch (error) {
            setMessages(prev => [...prev, { text: "API Error.", sender: "bot", isError: true }]);
        } finally {
            setLoading(false);
        }
    };

    const brandGreen = "#10b981";

    return (
        <>
            {open && (
                <Paper elevation={12} sx={{ position: "fixed", bottom: { xs: 0, sm: 90 }, right: { xs: 0, sm: 20 }, width: { xs: "100%", sm: 360 }, height: 500, display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: { xs: "16px 16px 0 0", sm: 3 }, zIndex: 9999 }}>
                    <Box sx={{ bgcolor: brandGreen, p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff" }}>
                        <Typography variant="h6" fontSize="1rem" fontWeight={600}>Realign Wellness Assistant</Typography>
                        <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "#fff" }}><CloseIcon /></IconButton>
                    </Box>

                    <Box ref={scrollRef} sx={{ flexGrow: 1, p: 2, bgcolor: "#fff", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                        {messages.map((msg, index) => (
                            <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                                <Box sx={{ display: "flex", gap: 1, flexDirection: msg.sender === "user" ? "row-reverse" : "row" }}>
                                    <Avatar sx={{ bgcolor: msg.sender === "user" ? "#cbd5e1" : brandGreen, width: 28, height: 28 }}>
                                        {msg.sender === "user" ? <PersonIcon sx={{ fontSize: 18 }} /> : <SmartToyIcon sx={{ fontSize: 16 }} />}
                                    </Avatar>
                                    <Box sx={{ maxWidth: "260px", p: 1.5, borderRadius: 2, bgcolor: msg.sender === "user" ? "#e6f9ef" : "#f1f5f9", fontSize: "0.875rem" }}>
                                        {msg.text}
                                    </Box>
                                </Box>
                                {msg.isSystem && mode === "select" && (
                                    <Button variant="outlined" size="small" onClick={() => selectMode("health")} sx={{ mt: 1, ml: 5, borderRadius: 4, textTransform: "none" }}>Health Advice</Button>
                                )}
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ p: 1.5, borderTop: "1px solid #f0f0f0", display: "flex", gap: 1 }}>
                        <TextField fullWidth size="small" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type here..." />
                        <IconButton onClick={handleSend} sx={{ bgcolor: brandGreen, color: "#fff", "&:hover": { bgcolor: "#059669" } }}><SendIcon fontSize="small" /></IconButton>
                    </Box>
                </Paper>
            )}
        </>
    );
}