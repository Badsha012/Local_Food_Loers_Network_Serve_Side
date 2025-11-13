const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Root test
app.get("/", (req, res) => {
  res.send("🍔 Server is Running Successfully!");
});

// Mongo URI
const uri =
  "mongodb+srv://FoodLover-db:UNbqlMyjK1p4Fq5u@cluster0.cyspe14.mongodb.net/?retryWrites=true&w=majority";

// Mongo client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Routes import
const favoritesRoutes = require("./routes/favoritesRoutes");

// Run
async function run() {
  try {
    await client.connect();
    const db = client.db("FoodLover-db");
    app.locals.db = db;

    const modelCollection = db.collection("FoodLovers");

    // Example route
    app.get("/FoodLovers", async (req, res) => {
      const result = await modelCollection.find().toArray();
      res.send(result);
    });

    // ✅ Mount Favorites Route
    app.use("/favorites", favoritesRoutes);

    await db.command({ ping: 1 });
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

// Run DB connection but start server anyway
run().finally(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
});
