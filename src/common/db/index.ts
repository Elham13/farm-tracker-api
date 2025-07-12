import { connect } from "mongoose";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/common/utils/logger";

const connectDb = async () => {
  try {
    if (!env.MONGO_URI)
      throw new Error("Could not find the MONGO_URI from env");
    const conn = await connect(env.MONGO_URI, {
      dbName: "farm-tracker",
    });
    logger.info(`MongoDB connected at ${conn.connection.host}`);
  } catch (error) {
    console.log("DB Error: ", (error as Error).message);
    process.exit(0);
  }
};

export default connectDb;
