import express from "express";

const router = express.Router();

let bills = [];

router.get ("/", (req, res) => {
    res.json(bills);
});

router.post("/", (req, res) => {
    const newBill = {
        id: Date.now().toString(),
        ...req.body,
    };
    bills.push(newBill);
    res.status(201).json(newBill);
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    bills = bills.filter(bill => bill.id !== id);
    res.json({ success: true});
});

export default router;