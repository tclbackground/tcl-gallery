require("dotenv").config();

const { MongoClient } = require("mongodb");

async function test() {
  const uri = process.env.DATABASE_URL;

  if (!uri) {
    throw new Error("DATABASE_URL is not defined in .env");
  }

  console.log("Connecting to MongoDB...");

  const client = new MongoClient(uri);

  try {
    await client.connect();

    console.log("✅ MongoDB connection successful");

    const db = client.db("tclgallery");

    const result = await db.command({ ping: 1 });

    console.log("✅ MongoDB Ping:", result);

    const collections = await db.listCollections().toArray();

    console.log(
      "✅ Collections:",
      collections.map((c) => c.name)
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error);
  } finally {
    await client.close();
  }
}

test();