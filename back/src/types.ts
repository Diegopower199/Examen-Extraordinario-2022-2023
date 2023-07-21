import { ObjectId } from "mongodb";

export type Event = {
  id: string;
  title: string;
  date: Date;
  init: number;
  end: number;
  participants: string[];
};

export type EventSchema = Omit<Event, "id"> & { _id: ObjectId };
