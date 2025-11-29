import express, { Request, Response } from "express";
import { MongoClient, ObjectId, Collection } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import {
  Battle,
  BattleTurn,
  BattleTurnRequest,
  Pokemon,
  Trainer,
} from "./models";

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

// process a turn in a battle
// body is the turn data
app.put("/battles/:battleId/turn", async (req: Request, res: Response) => {
  const battleId = req.params.battleId;
  const { turnRequest } = req.body as { turnRequest: BattleTurnRequest };

  if (!battleId) {
    return res.status(400).json({ error: "battleId is required" });
  }
  if (!turnRequest) {
    return res.status(400).json({ error: "turn data is required" });
  }
  const battle = await battles.findOne({ _id: new ObjectId(battleId) });

  if (!battle) {
    return res.status(404).json({ error: "battle not found" });
  }

  // validate turn is correct based on battle status
  const expectedMovingTrainer =
    battle.status === "trainer1turn"
      ? 1
      : battle.status === "trainer2turn"
      ? 2
      : 0;

  if (turnRequest.movingTrainer !== expectedMovingTrainer) {
    return res.status(400).json({ error: "not this trainer's turn to move" });
  }

  const previousTurn = battle.turns[battle.turns.length - 1];

  // if moveUsed is null, or pokemon fainted previous turn, it's a switch
  // validate that the pokemon being switched to is different from the current one
  // AND ALSO NOT FAINTED
  const noMoveUsed = turnRequest.moveUsed === null;
  const pokemonJustFainted =
    turnRequest.movingTrainer === 1
      ? previousTurn.team1status[turnRequest.pokemon1].hp <= 0
      : previousTurn.team2status[turnRequest.pokemon2].hp <= 0;

  if (noMoveUsed || pokemonJustFainted) {
    const isSwitchedToSamePokemon =
      turnRequest.movingTrainer === 1
        ? turnRequest.pokemon1 === previousTurn.pokemon1
        : turnRequest.pokemon2 === previousTurn.pokemon2;
    const isSwitchedToFaintedPokemon =
      turnRequest.movingTrainer === 1
        ? previousTurn.team1status[turnRequest.pokemon1].hp <= 0
        : previousTurn.team2status[turnRequest.pokemon2].hp <= 0;

    if (isSwitchedToSamePokemon) {
      return res
        .status(400)
        .json({ error: "cannot switch to the same pokemon" });
    }
    if (isSwitchedToFaintedPokemon) {
      return res
        .status(400)
        .json({ error: "cannot switch to a fainted pokemon" });
    }
  }

  // these are the status arrays that will be updated
  // based on the turn actions (just attacks for now, so only hp changes)
  const team1NewStatus = [...previousTurn.team1status];
  const team2NewStatus = [...previousTurn.team2status];

  if (turnRequest.moveUsed !== null) {
    // validate that the move exists on the pokemon
    const pokemon1 = battle.trainer1team[turnRequest.pokemon1];
    const pokemon2 = battle.trainer2team[turnRequest.pokemon2];
    const moveUsed =
      turnRequest.movingTrainer === 1
        ? pokemon1.Moves[turnRequest.moveUsed]
        : pokemon2.Moves[turnRequest.moveUsed];
    if (!moveUsed) {
      return res.status(400).json({ error: "invalid move used" });
    }

    // DAMAGE CALCULATION UPDATE LATER
    const damage = parseInt(moveUsed.Power) || 10;
    // DAMAGE CALULATION UPDATE LATER

    if (turnRequest.movingTrainer === 1) {
      const targetHp = team2NewStatus[turnRequest.pokemon2].hp - damage;
      team2NewStatus[turnRequest.pokemon2].hp = Math.max(targetHp, 0);
    } else {
      const targetHp = team1NewStatus[turnRequest.pokemon1].hp - damage;
      team1NewStatus[turnRequest.pokemon1].hp = Math.max(targetHp, 0);
    }
  }

  // update battle status
  const team1AllFainted = team1NewStatus.every((status) => status.hp <= 0);
  const team2AllFainted = team2NewStatus.every((status) => status.hp <= 0);

  const newStatus = team1AllFainted
    ? "trainer2win"
    : team2AllFainted
    ? "trainer1win"
    : battle.status === "trainer1turn"
    ? "trainer2turn"
    : "trainer1turn";

  const updatedTurn: BattleTurn = {
    turnNumber: previousTurn.turnNumber + 1,
    ...turnRequest,
    team1status: team1NewStatus,
    team2status: team2NewStatus,
  };

  const updatedBattle: Battle = {
    ...battle,
    status: newStatus,
    turns: [...battle.turns, updatedTurn],
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
