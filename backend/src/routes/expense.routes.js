import express from "express";
import { supabase } from "../lib/supabase.js";
import { checkJwt } from "../middleware/checkJwt.js";
import { getOrCreateUser } from "../lib/getOrCreateUser.js";

const router = express.Router();


router.get("/", checkJwt, async (req, res) => {
    try { 
        const user = await getOrCreateUser(req.auth);

        const { data, error } = await supabase
            .from("expense")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: true });
        
        if (error) throw error;
        
        res.json(data);
    } catch (err) { 
        console.error("GET expense error: ", err);
        res.status(500).json({ error: "Failed to fetch expense" });
    }
});

router.post("/", checkJwt, async (req,res) => {
    try {
        const user = await getOrCreateUser(req.auth);
        const { name, amount, date, reoccurring } = req.body;

        const { data, error } = await supabase
            .from("expense")
            .insert([
                {
                    user_id: user.id,
                    name,
                    amount: Number(amount),
                    date,
                    reoccurring: Number(reoccurring),
                },
            ])
            .select()
            .single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error("POST expense error: ", err);
        res.status(500).json({ error: "Failed to create expense "});
    }
});


router.delete("/:id", checkJwt, async (req,res) => {
    try {
        const user = await getOrCreateUser(req.auth);
        const { id } = req.params;

        const { error } = await supabase
            .from("expense")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;
        res.json({ success: true });
    } catch (err) { 
        console.error("DELETE expense error: ", err);
        res.status(500).json({ error: "Failed to delete expense" });
    }
});

export default router;