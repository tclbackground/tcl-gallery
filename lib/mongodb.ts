
import { MongoClient, Db } from "mongodb";

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error("DATABASE_URL is not configured");
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

const clientPromise =
  globalWithMongo._mongoClientPromise ??
  new MongoClient(uri, options).connect();

globalWithMongo._mongoClientPromise = clientPromise;

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("tclgallery");
}
