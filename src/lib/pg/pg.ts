
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


export interface LocalDBAuthProps {
  local_or_remote: "local";
  db_name: string;
  db_password: string;
  db_user: string;
  db_host: string;
}
export interface RemoteDBAuthProps {
  local_or_remote: "remote";
  connection_url: string;
}

export type DbAuthProps = LocalDBAuthProps | RemoteDBAuthProps;
