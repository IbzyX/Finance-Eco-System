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
        const { name, amount, tax, currency, frequency } = req.body;

        const numericAmount = Number(amount);
        const numericTax = Number(tax);

        const getMonthlyMultiplier = (frequency) => {
                switch (frequency.toLowerCase()) {
                    case "daily":
                        return 30;
                    case "weekly":
                        return 4;
                    case "fortnightly":
                        return 2;
                    case "monthly":
                        return 1;
                    case "quarterly":
                        return 1 / 3;
                    case "biannually":
                        return 1 / 6;
                    case "annually":
                        return 1 / 12;
                    case "no":
                    default:
                        return 0;
                }
            };

            const multiplier = getMonthlyMultiplier(frequency);
            const gross_monthly = numericAmount * multiplier;
            const net_monthly = gross_monthly * (1 - numericTax / 100);

        const { data, error } = await supabase
            .from("income")
            .insert([
                {
                    user_id: user.id,
                    name,
                    amount: numericAmount,
                    tax: numericTax,
                    currency,
                    frequency,
                    multiplier,
                    gross_monthly,
                    net_monthly,
                    date: new Date().toISOString(),

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