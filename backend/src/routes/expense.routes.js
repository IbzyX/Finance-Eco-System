import express from "express";

const router = express.Router();

let expense = [];

router.get("/", (req, res) => {
    res.json(expense);
});

router.post("/", (req,res) => {
    const newExpense = { 
        id: Date.now().toString(),
        ...req.body,
    };
    expense.push(newExpense);
    res.status(201).json(newExpense);
});

router.delete("/:id", (req,res) => {
    const { id } = req.params;
    expense = expense.filter(expense => expense.id !== id);

    res.json({ success: true });
});

export default router;