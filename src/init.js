import "dotenv/config";
//require("dotenv").config(); 대신 import 형식으로 넣으니 모든 곳에서 사용할 수 있음

import "./db";
import "./models/Video.js";
import "./models/User.js";
import app from "./server";

const PORT = 3500;

const handleListening = () =>
  console.log(`🎄 Server listening on port http://localhost:${PORT} 🎅`);

app.listen(PORT, handleListening);
