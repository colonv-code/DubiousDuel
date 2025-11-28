import express, { Request, Response } from "express";
import { MongoClient, ObjectId, Collection } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import { Battle, Pokemon, Trainer } from "./models";

dotenv.config({ path: "../.env.local" });

const app = express();
app.use(cors());
app.use(express.json());

// Load URI from environment
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not set");
}

const client = new MongoClient(mongoUri);
const db = client.db("DubiousDuel");
const pokemon: Collection<Pokemon> = db.collection("Pokemon");
const trainers: Collection<Trainer> = db.collection("Trainers");
const battles: Collection<Battle> = db.collection("Battles");

// get all pokemon
app.get("/pokemon", async (req: Request, res: Response) => {
  const result = await pokemon.find({}).toArray();
  res.json(result);
});

// get trainer by username
app.get("/trainer", async (req: Request, res: Response) => {
  const username = req.query.username as string;

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  const result = await trainers.findOne({ username });
  res.json(result);
});

// create or update trainer
app.put("/trainer", async (req: Request, res: Response) => {
  try {
    const trainer = req.body as Trainer;

    if (!trainer?.username) {
      return res.status(400).json({ error: "username is required" });
    }

    if (trainer.team.length > 6) {
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
app.get("/battles/refresh", async (req: Request, res: Response) => {
  const username = req.query.username as string;

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  const result = await battles
    .find({
      $or: [{ status: "new" }, { trainer1: username }, { trainer2: username }],
    })
    .toArray();

  res.json(result);
});

// create a new battle
// body is a trainer who is creating the battle
app.post("/battles", async (req: Request, res: Response) => {
  const trainer = req.body.trainer as Trainer;

  if (!trainer.username) {
    return res.status(400).json({ error: "username is required" });
  }

  const newBattle: Battle = {
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

// accept/join a battle
// body is a trainer who is joining the battle and battle id
app.put("/battles/:battleId/accept", async (req: Request, res: Response) => {
  const battleId = req.params.battleId;
  const { trainer } = req.body as { trainer: Trainer };
  if (!trainer.username) {
    return res.status(400).json({ error: "username is required" });
  }
  if (!battleId) {
    return res.status(400).json({ error: "battleId is required" });
  }

  const battle = await battles.findOne({ _id: new ObjectId(battleId) });

  if (!battle) {
    return res.status(404).json({ error: "battle not found" });
  }
  if (battle.trainer2) {
    return res.status(400).json({ error: "battle already has two trainers" });
  }
  const updatedBattle: Battle = {
    ...battle,
    status: "trainer2turn",
    trainer2: trainer.username,
    trainer2team: trainer.team,
    // initialize first turn, just sending out the first pokemon on each team
    turns: [
      {
        turnNumber: 0,
        movingTrainer: 1,
        moveUsed: null,
        pokemon1: 0,
        pokemon2: 0,
        team1status: battle.trainer1team.map((p: Pokemon) => ({
          hp: parseInt(p.HP),
        })),
        team2status: trainer.team.map((p: Pokemon) => ({ hp: parseInt(p.HP) })),
      },
    ],
  };

  await battles.updateOne(
    { _id: new ObjectId(battleId) },
    { $set: updatedBattle }
  );
  res.json(updatedBattle);
});

async function start() {
  await client.connect();
  console.log("Connected to MongoDB");

  app.listen(3001, () => console.log("API running on :3001"));
}

start();
