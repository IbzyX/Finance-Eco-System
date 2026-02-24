import express from "express";

const router = express.Router();

router.get("/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    const yahooURL = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1y`;

    const response = await fetch(yahooURL);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Yahoo request failed",
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Stock fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;