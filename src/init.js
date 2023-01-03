import "./db";
import "./models/Video.js";
import app from "./server";

const PORT = 4000;

const handleListening = () =>
  console.log(`🎄 Server listening on port http://localhost:${PORT} 🎅`);

app.listen(PORT, handleListening);
