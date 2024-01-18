import postgres from "postgres";

export function postgresInstance(options: DbAuthProps) {
  if (options.local_or_remote === "local") {
    return postgres({
      host: options.db_host,
      user: options.db_user,
      password: options.db_password,
      database: options.db_name,
      idle_timeout: 20,
      max_lifetime: 60 * 30,
    });
  }
  return postgres(options.connection_url, {
    idle_timeout: 20,
    max_lifetime: 60 * 30,
  });
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
