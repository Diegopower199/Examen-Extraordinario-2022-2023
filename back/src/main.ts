import express from "express";
import cors from "cors";

import event from "./resolvers/event.ts";
import events from "./resolvers/events.ts";
import deleteEvent from "./resolvers/deleteEvent.ts";
import updateEvent from "./resolvers/updateEvent.ts";
import addEvent from "./resolvers/addEvent.ts";

const app = express();

app.use(cors());
app.use(express.json());

app
  .get("/events", events)
  .get("/event/:id", event)
  .post("/addEvent", addEvent)
  .put("/updateEvent", updateEvent)
  .delete("/deleteEvent/:id", deleteEvent);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
