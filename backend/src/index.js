import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "Backend API running " });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
