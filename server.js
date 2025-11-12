app.get('/featured-reviews', async (req, res) => {
  try {
    const result = await modelcollection
      .find({})
      .sort({ rating: -1 }) // rating highest first
      .limit(6)
      .toArray();
    res.send(result);
  } catch (err) {
    console.error("Error fetching featured reviews:", err);
    res.status(500).send({ message: "Error fetching featured reviews" });
  }
});
