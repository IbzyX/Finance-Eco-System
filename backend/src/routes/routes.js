import express from "express";
import axios from "axios";
import { checkJwt } from "../middleware/checkJwt.js";
import { supabase } from "../lib/supabase.js";
import { getOrCreateUser } from "../lib/getOrCreateUser.js";
import billsRoutes from "./bills.routes.js";

const router = express.Router();

router.use("/bills", billsRoutes);



router.get("/profile", checkJwt, async (req, res) => {
  console.log("profile hit");
  console.log("AUTH:", req.auth);
  try {
    const user = await getOrCreateUser(req.auth);
    res.json({
      message: "You are authorized",
      user: {
        id: user.id,
        email: user.email,
        auth0_id: user.auth0_id
      }
    });
  } catch (err) {
    console.error("profile error:", err);
    res.status(500).json({ error: "Failed to load user" });
  }
});

const userTokens = {};

const {
  TRUELAYER_CLIENT_ID,
  TRUELAYER_CLIENT_SECRET,
  TRUELAYER_REDIRECT_URI
} = process.env;




router.get("/truelayer/connect", checkJwt, (req, res) => {
  const url =
    `https://auth.truelayer-sandbox.com/?response_type=code` +
    `&client_id=${TRUELAYER_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(TRUELAYER_REDIRECT_URI)}` +
    `&scope=accounts%20balance%20transactions%20info`;

  res.send(url);
});






router.post("/truelayer/exchange", checkJwt, async (req, res) => {
  const { code } = req.body;
  const user = await getOrCreateUser(req.auth);
  const userId = user.id; 

  try {
    const response = await axios.post("https://auth.truelayer-sandbox.com/connect/token", {
      grant_type: "authorization_code",
      client_id: TRUELAYER_CLIENT_ID,
      client_secret: TRUELAYER_CLIENT_SECRET,
      redirect_uri: TRUELAYER_REDIRECT_URI,
      code
    });

    userTokens[userId] = response.data.access_token;
    res.json({ success: true });
  } catch (err) {
    console.log(" TL exchange error:", err.response?.data);
    res.status(500).json({ error: "OAuth failed" });
  }
});

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
    console.log(" Fetch error:", err.response?.data);
    res.status(500).json({ error: "Could not fetch accounts" });
  }
});

router.post("/truelayer/disconnect", checkJwt, (req, res) => {
  const userId = req.auth.sub;
  delete userTokens[userId];
  res.json({ success: true });
});

export default router;
