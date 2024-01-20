import postgres from "postgres";
import { Redirect, useSSQ } from "rakkasjs";
import { PickDatabaseDialog } from "./PickDatabaseDialog";
import { DbAuthProps, postgresInstance } from "@/lib/pg/pg";
import { safeDestr } from "destr";
interface DatabasesProps {}

export function Databases({}: DatabasesProps) {
  const query = useSSQ(async (ctx) => {
    try {
      // console.log("databases use ssq locals == ", ctx.cookie);
      const config = safeDestr<DbAuthProps>(ctx.cookie?.pg_cookie);
      if (!config) {
        return { result: null, error: "no config" };
      }
      const sql = postgresInstance(config);
      if (config.local_or_remote === "remote") {
        return {
          result: { redirect: `/pg/dbs/${sql.options.database}` },
          error: null,
        };
      }
      const database = (await sql`SELECT datname FROM pg_database`) as any as [
        { datname: string },
      ];
      const users = (await sql`SELECT * FROM pg_catalog.pg_user`) as any as [
        { usename: string },
      ];
      console.log(" === databases == ", database);
      console.log(" === users == ", users);
      return { result: { database, users }, error: null };
    } catch (error: any) {
      console.log(" === error == ", error.message);
      return { result: null, error };
    }
  });

  const dbs = query?.data?.result?.database;
  const users = query?.data?.result?.users;
  const error = query?.data?.error;

  if (query.data?.result?.redirect) {
    return <Redirect href={query.data?.result?.redirect} />;
  }

  return (
    <div className="w-full h-full flex flex-col gap-5 ">
      <h1 className="text-3xl font-bold text-center w-full ">Databases</h1>
      {error && (
        <div
          className="h-full w-full flex flex-col justify-center items-center gap-5 
         ">
          <h1 className=" text-center text-lg w-fit p-5  bg-error/10 rounded shadow shadow-error/30 ">
            {error}
          </h1>
        </div>
      )}
      {dbs && dbs.length > 0 && (
        <div className="w-full min-h-[70vh] md:min-h-[40vh] h-fit flex items-center justify-center">
          <ul className="w-full  flex flex-wrap gap-2 items-center justify-center px-4">
            {dbs &&
              dbs?.map((db: { datname: string }) => {
                return (
                  <li
                    key={db.datname}
                    className=" min-w-[30%] flex  justify-center items-center
                 flex-grow rounded-lg"
                  >
                    <PickDatabaseDialog datname={db.datname} users={users} />
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}
