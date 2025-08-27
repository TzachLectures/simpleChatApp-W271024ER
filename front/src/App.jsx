import {
  Container,
  Box,
  TextField,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import ChatMessage from "./ChatMessage";
import { io } from "socket.io-client";
import { useState } from "react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
const socket = io("http://localhost:8181");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState(
    sessionStorage.getItem("userName") ?? ""
  );
  const [allUsers, setAllUsers] = useState({});

  useEffect(() => {
    socket.on("message recived", (data) => setMessages(data));
    socket.on("userName change recived", (data) => setAllUsers(data));
  }, [socket]);

  useEffect(() => {
    socket.emit("userName changed", userName);
  }, [userName]);

  const sendMessage = () => {
    if (!message) return;

    const msgObj = {
      id: uuidv4(),
      text: message,
      sender: userName || "Anonymus",
      time: new Date(),
    };

    socket.emit("message sent", msgObj);
    setMessage("");
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        direction: "rtl",
      }}
    >
      {Object.values(allUsers).map((u) => (
        <>
          <div key={u}>{u}</div>
          <br></br>
        </>
      ))}{" "}
      <Box sx={{ width: "100%" }}>
        {/* Chat shell */}
        <Paper
          elevation={3}
          sx={{
            p: 0,
            borderRadius: 3,
            overflow: "hidden",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(250,250,250,0.92) 100%)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Messages area (empty by design) */}
          <Box
            sx={{
              height: { xs: 260, sm: 300, md: 340 },
              px: 3,
              pt: 3,
              pb: 2,
              overflowY: "auto",
              position: "relative",
              "&::-webkit-scrollbar": { width: 8 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "action.selected",
                borderRadius: 8,
              },
              background:
                "repeating-linear-gradient(180deg, transparent 0 28px, rgba(0,0,0,0.02) 28px 29px)",
            }}
          >
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isItMyMessage={msg.sender === userName}
              />
            ))}
          </Box>

          <Divider />

          {/* Input row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "stretch",
              gap: 0,
              p: 1,
              backgroundColor: "background.paper",
            }}
          >
            <TextField
              fullWidth
              placeholder="הקלד/י הודעה…"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <Button
              variant="contained"
              disableElevation
              sx={{
                px: 4,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderTopRightRadius: 12,
                borderBottomRightRadius: 12,
                bgcolor: "grey.200",
                color: "text.primary",
                "&:hover": { bgcolor: "grey.300" },
              }}
              onClick={sendMessage}
            >
              send
            </Button>
          </Box>
        </Paper>

        {/* Name field */}
        <Box sx={{ mt: 3, maxWidth: 260 }}>
          <TextField
            fullWidth
            label="Your name"
            variant="outlined"
            size="medium"
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 12 },
            }}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              sessionStorage.setItem("userName", e.target.value);
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}
