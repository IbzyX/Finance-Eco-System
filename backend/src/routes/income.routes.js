import express from "express";

const router = express.Router();

let income = [];

router.get ("/", (req, res) => {
    res.json(income);
});

router.post("/", (req, res) => {
    const newIncome = {
        id: Date.now().toString(),
        ...req.body,
    };
    income.push(newIncome);
    res.status(201).json(newIncome);
});
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    income = income.filter(income => income.id !== id);
    res.json({ success: true });
});

export default router;