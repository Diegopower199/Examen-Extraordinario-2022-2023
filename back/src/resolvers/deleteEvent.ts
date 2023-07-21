import express from "express";
import client from "../db.ts";
import { ObjectId } from "mongodb";

import { DB_NAME } from "../env.ts";

const deleteEvent = async (req: express.Request, res: express.Response) => {
  try {
    // read id from params
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    // connect to database
    await client.connect();
    const db = client.db(DB_NAME);

    // delete event
    const deleteEvent = await db
      .collection("events")
      .deleteOne({ _id: new ObjectId(id) });
    if (!deleteEvent) {
      res.status(404).json({ message: "Event not found" });
      client.close();
      return;
    }

    res.status(200).json({ message: "Event deleted" });
    // close connection
    client.close();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteEvent;
