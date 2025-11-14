import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

const app = express();
app.use(cors());
app.use(express.json());

// Load URI from environment
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("DubiousDuel");
const pokemon = db.collection("Pokemon");

app.get("/pokemon", async (req, res) => {
  const all = await pokemon.find({}).toArray();
  res.json(all);
});

async function start() {
  await client.connect();
  console.log("Connected to MongoDB");

  app.listen(3001, () => console.log("API running on :3001"));
}

start();
