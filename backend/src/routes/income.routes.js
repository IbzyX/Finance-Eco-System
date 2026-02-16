import express from "express";
import { supabase } from "../lib/supabase.js";
import { checkJwt } from "../middleware/checkJwt.js";
import { getOrCreateUser } from "../lib/getOrCreateUser.js";

const router = express.Router();


router.get ("/", checkJwt, async (req, res) => {
    try {
        const user = await getOrCreateUser(req.auth);

        const { data, error } = await supabase
            .from("income")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: true });
        
        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error("GET income error: ", err);
        res.status(500).json({ error: "Failed to fetch income" });
    }
});

router.post("/", checkJwt, async (req, res) => {
    try {
        const user = await getOrCreateUser(req.auth);
        const { name, amount, tax, currency, frequency, multiplier } = req.body;
        const { data, error } = await supabase
            .from("income")
            .insert([
                {
                    user_id: user.id,
                    name,
                    amount: Number(amount),
                    tax: Number(tax),
                    currency,
                    frequency,
                    multiplier: Number(multiplier),
                },
            ])
            .select()
            .single();
        if (error) throw error;

        res.status(201).json(data);
    } catch (err) {
        console.error("POST income error: ", err);
        res.status(500).json({ error: "Failed to create income" });
    }
});


router.delete("/:id", checkJwt, async (req, res) => {
  try {
    const user = await getOrCreateUser(req.auth);
    const { id } = req.params;

    const { error } = await supabase
      .from("income")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE income error:", err);
    res.status(500).json({ error: "Failed to delete income" });
  }
});

export default router;