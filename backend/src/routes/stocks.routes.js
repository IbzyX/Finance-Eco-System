import express from "express";
import { supabase } from "../lib/supabase.js";
import { checkJwt } from "../middleware/checkJwt.js";
import { getOrCreateUser } from "../lib/getOrCreateUser.js";

const router = express.Router();

router.get ("/", checkJwt, async (req, res) => {
  try {
    const user = await getOrCreateUser(req.auth);
    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Get investment error: ", err)
    res.status(500).json({ error: "Failed to fetch investments "});
  }
});

router.post("/", checkJwt, async (req, res) => {
  try {
    const user = await getOrCreateUser(req.auth);
    const { name, type, amount, currency, contribuitonInterval, contribuitonAmount, avarageValue, DoP } = req.body;
    const { data, error } = await supabase
      .from("investments")
      .insert([
        { 
          user_id: user.id,
          name,
          type,
          amount: Number(amount),
          currency,
          contribuitonInterval,
          contribuitonAmount: Number(contribuitonAmount),
          avarageValue: Number(avarageValue),
          DoP,
        },
      ])
      .select()
      .single();
    if(error)  throw error;
  } catch (err) {
    console.error("Post investments error: ", err);
    res.status(500).json({ error: "Failed to create investment" });
  }
});

router.delete("/:id", checkJwt, async (req,res) => {
    try {
        const user = await getOrCreateUser(req.auth);
        const { id } = req.params;

        const { error } = await supabase
            .from("investments")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;
        res.json({ success: true });
    } catch (err) { 
        console.error("DELETE investment error: ", err);
        res.status(500).json({ error: "Failed to delete investment" });
    }
});

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