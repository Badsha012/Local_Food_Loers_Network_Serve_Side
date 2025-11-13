const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

/**
 * 🟢 Add a review to favorites
 * Endpoint: POST /favorites
 * Body: { userEmail, reviewId, reviewTitle, reviewImage, rating }
 */
router.post("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const favoritesCollection = db.collection("favorites");
    const favorite = req.body;

    // ✅ Validation
    if (!favorite.userEmail || !favorite.reviewId) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    // ✅ Check if already exists
    const exists = await favoritesCollection.findOne({
      reviewId: favorite.reviewId,
      userEmail: favorite.userEmail,
    });

    if (exists) {
      return res.status(400).send({ message: "Already in favorites" });
    }

    // ✅ Insert new favorite
    const result = await favoritesCollection.insertOne({
      ...favorite,
      createdAt: new Date(),
    });

    res.status(201).send({
      success: true,
      message: "Added to favorites",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("❌ Error adding favorite:", err);
    res.status(500).send({ message: "Failed to add favorite" });
  }
});

/**
 * 🟡 Get all favorites of a user
 * Endpoint: GET /favorites?userEmail=someone@gmail.com
 */
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const email = req.query.userEmail;

    if (!email) {
      return res.status(400).send({ message: "userEmail query required" });
    }

    const favorites = await db
      .collection("favorites")
      .find({ userEmail: email })
      .toArray();

    res.send(favorites);
  } catch (err) {
    console.error("❌ Error fetching favorites:", err);
    res.status(500).send({ message: "Failed to fetch favorites" });
  }
});

/**
 * 🔴 Delete a favorite by its _id
 * Endpoint: DELETE /favorites/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid ID" });
    }

    const result = await db
      .collection("favorites")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Favorite not found" });
    }

    res.send({ success: true, message: "Favorite removed" });
  } catch (err) {
    console.error("❌ Error deleting favorite:", err);
    res.status(500).send({ message: "Failed to delete favorite" });
  }
});

module.exports = router;
