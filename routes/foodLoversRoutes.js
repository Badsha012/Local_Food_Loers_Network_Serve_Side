const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// GET all reviews or user-specific
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { userEmail } = req.query;
    const filter = userEmail ? { userEmail } : {};
    const reviews = await db.collection("FoodLovers").find(filter).sort({ createdAt: -1 }).toArray();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST new review
router.post("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const review = { ...req.body, createdAt: new Date() };
    const result = await db.collection("FoodLovers").insertOne(review);
    res.status(201).json({ ...review, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to add review" });
  }
});

// DELETE review
router.delete("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const id = req.params.id;
    const result = await db.collection("FoodLovers").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

// PUT (edit) review
router.put("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const id = req.params.id;
    const updated = await db.collection("FoodLovers").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: req.body },
      { returnDocument: "after" }
    );
    res.json(updated.value);
  } catch (err) {
    res.status(500).json({ error: "Failed to update review" });
  }
});

module.exports = router;
