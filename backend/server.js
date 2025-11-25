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
const trainers = db.collection("Trainers");
const battles = db.collection("Battles");

// get all pokemon
app.get("/pokemon", async (req, res) => {
  const all = await pokemon.find({}).toArray();
  res.json(all);
});

// get trainer by username
app.get("/trainer", async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  const trainer = await trainers.findOne({ username });
  res.json(trainer);
});

// create or update trainer
app.put("/trainer", async (req, res) => {
  try {
    const trainer = req.body;

    if (!trainer?.username) {
      return res.status(400).json({ error: "username is required" });
    }

    if (!trainer.team.length > 6) {
      return res.status(400).json({ error: "too many pokemon" });
    }

    const result = await trainers.updateOne(
      { username: trainer.username }, // match by username
      { $set: trainer }, // replace team or any fields provided
      { upsert: true } // insert if no exist update if it does
    );

    res.json(trainer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

// refresh battles for a trainer
// get "new" status battles or battles where trainer is a participant
// (either as trainer1 or trainer2)
app.get("/battles/refresh", async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  const battles = await battles
    .find({
      $or: [{ status: "new" }, { trainer1: username }, { trainer2: username }],
    })
    .toArray();

  res.json(battles);
});

// create a new battle
// body is a trainer who is creating the battle
app.post("/battles", async (req, res) => {
  const trainer = req.body;

  if (!trainer?.username) {
    return res.status(400).json({ error: "username is required" });
  }

  const newBattle = {
    status: "new",
    trainer1: trainer.username,
    trainer1team: trainer.team,
    trainer2: "",
    trainer2team: [],
    turns: [],
  };

  const result = await battles.insertOne(newBattle);
  res.json(newBattle);
});

async function start() {
  await client.connect();
  console.log("Connected to MongoDB");

  app.listen(3001, () => console.log("API running on :3001"));
}

start();
