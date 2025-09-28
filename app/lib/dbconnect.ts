import mongoose, { connect } from "mongoose";

let mongooseConnection: typeof mongoose | null = null;

async function dbconnect() {
  if (mongooseConnection) return;
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not defined");
  }
  try {
    mongooseConnection = await connect(process.env.DATABASE_URL);
    console.log("connected to database");
  } catch (error) {
    console.error("MongoDB connection Error: ", error);
    throw error;
  }
}

export default dbconnect;
