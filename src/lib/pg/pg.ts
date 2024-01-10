// db.js
import postgres from "postgres";

const sql = postgres({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "postgres",
  
}); // will use psql environment variables

export default sql;
