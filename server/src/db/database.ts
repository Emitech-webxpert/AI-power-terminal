// src/db/database.ts

import { Sequelize } from "sequelize";
import { getEnv } from "@config/index";

const sequelize = new Sequelize(
  getEnv("DB_NAME"),
  getEnv("DB_USER"),
  getEnv("DB_PASSWORD"),
  {
    host: getEnv("DB_HOST"),
    dialect: "postgres",
    logging: false,
  }
);

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
    
    await sequelize.sync({ force: true });
    console.log("Database tables synced!");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

connectDB();

export default sequelize;