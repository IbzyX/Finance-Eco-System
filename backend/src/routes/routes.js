import express from "express";
import axios from "axios";
import { checkJwt } from "../middleware/checkJwt.js";

const router = express.Router();

router.get("/profile", checkJwt, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.auth,
  });
});

// Temporary in-memory storage replace with DB
const userTokens = {};

const {
  TRUELAYER_CLIENT_ID,
  TRUELAYER_CLIENT_SECRET,
  TRUELAYER_REDIRECT_URI
} = process.env;




// Redirect to TrueLayer login
router.get("/truelayer/connect", checkJwt, (req, res) => {
  console.log("👉 TrueLayer connect hit");

  const url =
    `https://auth.truelayer.com/?response_type=code` +
    `&client_id=${TRUELAYER_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(TRUELAYER_REDIRECT_URI)}` +
    `&scope=info%20accounts%20balance%20transactions`;

  return res.json({ url });
});


// Exchange code for token
router.post("/truelayer/exchange", checkJwt, async (req, res) => {
  const { code } = req.body;
  const userId = req.auth.sub;

  try {
    const response = await axios.post("https://auth.truelayer.com/connect/token", {
      grant_type: "authorization_code",
      client_id: TRUELAYER_CLIENT_ID,
      client_secret: TRUELAYER_CLIENT_SECRET,
      redirect_uri: TRUELAYER_REDIRECT_URI,
      code
    });

    userTokens[userId] = response.data.access_token;
    res.json({ success: true });
  } catch (err) {
    console.log("❌ TL exchange error:", err.response?.data);
    res.status(500).json({ error: "OAuth failed" });
  }
});

// Get accounts
router.get("/truelayer/accounts", checkJwt, async (req, res) => {
  const userId = req.auth.sub;
  const token = userTokens[userId];

  if (!token) return res.status(401).json({ error: "No bank connected" });

  try {
    const response = await axios.get(
      "https://api.truelayer.com/data/v1/accounts",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json(response.data);
  } catch (err) {
    console.log("❌ Fetch error:", err.response?.data);
    res.status(500).json({ error: "Could not fetch accounts" });
  }
});

// Disconnect
router.post("/truelayer/disconnect", checkJwt, (req, res) => {
  const userId = req.auth.sub;
  delete userTokens[userId];
  res.json({ success: true });
});

export default router;
