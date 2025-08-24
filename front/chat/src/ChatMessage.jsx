// ChatMessage.jsx
import { Box, Paper, Typography } from "@mui/material";

export default function ChatMessage({ message, isItMyMessage }) {
  const { sender, time, text } = message;

  // פורמט זמן קצר אם הגיע Date
  const timeLabel =
    time instanceof Date
      ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : time;

  // צד, צבעים ופינות לפי מקור ההודעה
  const side = isItMyMessage ? "flex-start" : "flex-end"; // ירוק משמאל כמו באפיון
  const bubbleBg = isItMyMessage ? "success.light" : "info.light";
  const textColor = "text.primary";

  // רדיוסים: "זנב" קטן בצד הנגדי
  const radius = isItMyMessage
    ? "16px 16px 16px 6px" // שלי: פינה תחתונה-ימנית חדה מעט
    : "16px 16px 6px 16px"; // אחר: פינה תחתונה-שמאלית חדה מעט

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: side,
        my: 1.5,
        px: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          bgcolor: bubbleBg,
          color: textColor,
          px: 2,
          py: 1.5,
          maxWidth: { xs: "82%", sm: "70%" },
          borderRadius: radius,
          position: "relative",
        }}
      >
        {!isItMyMessage && (
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, mb: 0.5, opacity: 0.9 }}
          >
            {sender}
          </Typography>
        )}

        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {text}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            left: 10, // באפיון השעה בפינה השמאלית-תחתונה
            bottom: 6,
            opacity: 0.8,
          }}
        >
          {timeLabel}
        </Typography>
      </Paper>
    </Box>
  );
}
