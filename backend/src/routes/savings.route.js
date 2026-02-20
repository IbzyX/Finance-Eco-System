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
            .order("targetDate", { ascending: true });
        
        if (error) throw error;

        const now = new Date();
        const savings = data.map((saving) => {
            const now = new Date();
            const start = new Date(saving.startDate); 
            const msPassed = now - start;
            const daysPassed = Math.floor(msPassed / (1000 * 60 * 60 * 24));

            const intervalMap = {
                no: 0,
                daily: 1,
                weekly: 7,
                fortnightly: 14,
                monthly: 30,
                quarterly: 90,
                biannually: 182,
                annually: 365,
            };

            const intervalKey = saving.contributionInterval?.toLowerCase().trim();
            const intervalDays = intervalMap[intervalKey] || 0;

            const intervalPassed =
                intervalDays > 0 ? Math.floor(daysPassed / intervalDays) : 0;

            const totalAmount =
                Number(saving.initialAmount) +
                intervalPassed * Number(saving.contributionAmount);

            return {
                ...saving,
                totalAmount,
                intervalPassed,
            };
        });


        res.json(savings);
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

router.put("/:id", checkJwt, async (req, res) => {
  try {
        const user = await getOrCreateUser(req.auth);
        const { id } = req.params;

        const {
            goal,
            startDate,
            initialAmount,
            contributionInterval,
            contributionAmount,
            targetDate,
            targetAmount,
            aer,
        } = req.body;

        const { data, error } = await supabase
        .from("savings")
        .update({
            goal,
            startDate,
            initialAmount: Number(initialAmount),
            contributionInterval,
            contributionAmount: Number(contributionAmount),
            targetDate,
            targetAmount: Number(targetAmount),
            aer,
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error("UPDATE savings error:", err);
        res.status(500).json({ error: "Failed to update savings" });
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