import express from "express";
import { supabase } from "../lib/supabase.js";
import { checkJwt } from "../middleware/checkJwt.js";
import { getOrCreateUser } from "../lib/getOrCreateUser.js";

const router = express.Router();

// -- GET USER BILLS 
router.get("/", checkJwt, async (req, res) => {
  try {
    const user = await getOrCreateUser(req.auth);

    const { data, error } = await supabase
      .from("bills")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("GET bills error:", err);
    res.status(500).json({ error: "Failed to fetch bills" });
  }
});

// -- CREATE BILL 
router.post("/", checkJwt, async (req, res) => {
  try {
    const user = await getOrCreateUser(req.auth);

    const { name, amount, date, type, recurring } = req.body;

    const { data, error } = await supabase
      .from("bills")
      .insert([
        {
          user_id: user.id,
          name,
          amount: Number(amount),
          date,
          type: type || "General",
          recurring: recurring || false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error("POST bill error:", err);
    res.status(500).json({ error: "Failed to create bill" });
  }
});

// -- DELETE BILL 
router.delete("/:id", checkJwt, async (req, res) => {
  try {
    const user = await getOrCreateUser(req.auth);
    const { id } = req.params;

    const { error } = await supabase
      .from("bills")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE bill error:", err);
    res.status(500).json({ error: "Failed to delete bill" });
  }
});

export default router;