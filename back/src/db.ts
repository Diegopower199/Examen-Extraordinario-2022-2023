import { MongoClient } from "mongodb";
import { MONGO_URL } from "./env.ts";

const url = MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(url);

export default client;
