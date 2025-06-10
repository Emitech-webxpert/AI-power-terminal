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
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Database connection failed:", err));

export default sequelize;