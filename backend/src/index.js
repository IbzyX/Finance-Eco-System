import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "../routes/routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ message: "Backend API running" });
});

app.use("/api", routes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
