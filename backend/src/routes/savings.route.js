import express from "express";
import { supabase } from "../lib/supabase.js";
import { checkJwt } from "../middleware/checkJwt.js";
import { getOrCreateUser } from "../lib/getOrCreateUser.js";

const router = express.Router();

router.get("/", checkJwt, async (req, res)  => {
    try {
        const user = await getOrCreateUser(req.auth);
        const { data, error } = await supabase
            .from("savings")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: true });
        
        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error("GET savings error: ", err);
        res.status(500).json({ error: "Failed to fetch Savings " });
    }
});

router.post("/", checkJwt, async (req, res) => {
    try {
        const user = await getOrCreateUser(req.auth);

        const { goal, startDate, initialAmount, contributionInterval, contributionAmount, targetDate, targetAmount, aer } = req.body;
        const { data, error } = await supabase
            .from("savings")
            .insert([
                {
                    user_id: user.id,
                    goal,
                    startDate,
                    initialAmount: Number(initialAmount),
                    contributionInterval,
                    contributionAmount: Number(contributionAmount),
                    targetDate,
                    targetAmount: Number(targetAmount),
                    aer,
                },
            ])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error("POST savings error: ", err);
        res.status(500).json({ error: "Failed to create Savings" });
    }
});

router.delete("/:id", checkJwt, async (req, res) => {
    try {
        const user = await getOrCreateUser(req.auth);
        const { id } = req.params;

        const { error } = await supabase 
            .from("savings")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id)
        
        if (error) throw error;

        res.json({ success: true });
    } catch (err) {
        console.error("DELETE saving error: ", err);
        res.status(500).json({ error: "Failed to delete saving" });
    }
});

export default router;