import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set - using mock database");
		// Return a mock that mimics the drizzle interface but returns empty results
		return null;
  }

  try {
		// for query purposes
		const queryClient = postgres(process.env.DATABASE_URL);
		const db = drizzle(queryClient);
		return db;
	} catch (error) {
		console.error("Failed to connect to database:", error);
		return null;
	}
};

export default setup();
