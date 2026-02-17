import express from "express";
import { supabase } from "../lib/supabase.js";
import { checkJwt } from "../middleware/checkJwt.js";
import { getOrCreateUser } from "../lib/getOrCreateUser.js";

const router = express.Router();

router.get("/", checkJwt, async (req, res) => {
    try {
        const user = await getOrCreateUser(req.auth);

        const { data, error } = await supabase
        .from("dashboard_layout")
        .select("*")
        .eq("user_id", user.id)
        .single();

        if (error && error.code !== "PGRST116") throw error;

        res.json(data || null);
    } catch (err) {
        console.error("Get layout error: ", err);
        res.status(500).json({ error: "Falied to fetch layout" });
    }
});

router.post("/", checkJwt, async (req, res) => {
    try {
        const user = await getOrCreateUser(req.auth);
        const { layout } = req.body;

        const { data, error } = await supabase
        .from("dashboard_layout")
        .upsert( 
            {
                user_id: user.id,
                layout,
            },
            { onConflict: "user_id" }
        )
        .select()
        .single();

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error("SAVE layout error: ", err);
        res.status(500).json({ error: "Failed to save layout" });
    }
});

export default router;