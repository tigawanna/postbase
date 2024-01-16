
import postgres from "postgres";

export function postgresInstance(options?: postgres.Options<{}> | undefined){
  const pg_opts = options || {  
    host: "localhost",
    user: "postgres",
    password: "postgres",
    database: "postgres",
    idle_timeout: 20,
    max_lifetime: 60 * 30
  };
return  postgres(pg_opts);
} 
