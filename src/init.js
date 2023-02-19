import "./db";
import "./models/Video.js";
import "./models/User.js";
import app from "./server";

const PORT = 3500;

const handleListening = () =>
  console.log(`🎄 Server listening on port http://localhost:${PORT} 🎅`);

app.listen(PORT, handleListening);
