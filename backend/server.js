import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import dns from "node:dns";

dotenv.config();

// Use Cloudflare DNS
dns.setServers([
  "1.1.1.1",
  "1.0.0.1",
]);


connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
