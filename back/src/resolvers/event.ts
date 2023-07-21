import { ObjectId } from "mongodb";
import client from "../db.ts";
import express from "express";
import { EventSchema } from "../types.ts";
import { DB_NAME } from "../env.ts";

const event = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(404).json({ message: "Event not Found" });
      return;
    }
    await client.connect();
    const db = client.db(DB_NAME);
    const event = await db
      .collection<EventSchema>("events")
      .findOne({ _id: new ObjectId(id) });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      client.close();
      return;
    }

    const { _id, ...rest } = event;

    res.json({ id: _id.toString(), ...rest });
    client.close();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default event;
