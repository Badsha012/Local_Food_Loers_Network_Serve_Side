const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

/**
 * 🟢 Add a review to favorites
 * Endpoint: POST /favorites
 */
router.post("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const favoritesCollection = db.collection("favorites");
    const favorite = req.body;

    if (!favorite.userEmail || !favorite.reviewId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await favoritesCollection.findOne({
      userEmail: favorite.userEmail,
      reviewId: favorite.reviewId,
    });

    if (exists) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    const result = await favoritesCollection.insertOne({
      ...favorite,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Added to favorites", id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add favorite" });
  }
});

/**
 * 🟡 Get all favorites for a user
 * Endpoint: GET /favorites?userEmail=someone@gmail.com
 */
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const email = req.query.userEmail;

    if (!email) {
      return res.status(400).json({ message: "userEmail required" });
    }

    const favorites = await db.collection("favorites").find({ userEmail: email }).toArray();
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
});

/**
 * 🔴 Delete a favorite by _id
 * Endpoint: DELETE /favorites/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const id = req.params.id;

    const result = await db.collection("favorites").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Favorite removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete favorite" });
  }
});

module.exports = router;
