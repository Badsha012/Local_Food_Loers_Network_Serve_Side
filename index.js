

const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Mongo URI
const uri =
  "mongodb+srv://FoodLover-db:UNbqlMyjK1p4Fq5u@cluster0.cyspe14.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

// Routes
const favoritesRoutes = require("./routes/favoritesRoutes");
const foodLoversRoutes = require("./routes/foodLoversRoutes"); // AddReview/MyReviews

// Root test
app.get("/", (req, res) => {
  res.send("🍔 Server is Running Successfully!");
});

// Mount routes
app.use("/favorites", favoritesRoutes);
app.use("/FoodLovers", foodLoversRoutes); // ✅ Mount foodLovers routes

async function run() {
  try {
    await client.connect();
    const db = client.db("FoodLover-db");
    app.locals.db = db;

    await db.command({ ping: 1 });
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

// Start server
run().finally(() => {
  app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
});
