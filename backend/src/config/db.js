import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Podcastdb",
  password: "12345",
  port: 5432,
});

export default pool;
