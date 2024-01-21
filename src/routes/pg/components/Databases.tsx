import { Redirect, useSSQ } from "rakkasjs";
import { DbAuthProps, postgresInstance } from "@/lib/pg/pg";
import { safeDestr } from "destr";
import { PickDatabaseDialog } from "./PickDatabaseDialog";

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
      if (!sql) {
        return { result: null, error: "no config" };
      }

      if (config.local_or_remote === "remote") {
        return {
          result: { redirect: `/pg/${sql.options.database}` },
          error: null,
        };
      }
      const database = (await sql`SELECT datname FROM pg_database`) as any as [
        { datname: string },
      ];
      const users = (await sql`SELECT * FROM pg_catalog.pg_user`) as any as [
        { usename: string },
      ];
      // console.log(" === databases == ", database);
      // console.log(" === users == ", users);
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
    <div className="w-full h-full overflow-auto flex flex-col gap-4   ">
      <h1 className="text-3xl font-bold text-center w-full ">
        Databases
      </h1>
      {error && (
        <div
          className="h-full w-full flex flex-col justify-center items-center gap-5 
         "
        >
          <h1 className=" text-center text-lg w-fit p-5  bg-error/10 rounded shadow shadow-error/30 ">
            {error}
          </h1>
        </div>
      )}
      {dbs && dbs.length > 0 && (
        <div className="w-full min-h-[70vh] md:min-h-[40vh] px-3  ">
          <ul className="w-full  flex flex-wrap gap-2  pb-10">
            {dbs &&
              dbs?.map((db: { datname: string }) => {
                return (
                  <li
                    key={db.datname}
                    className="w-full  md:w-[35%] lg:w-[25%]  flex justify-center items-center
                     flex-grow rounded-lg h-[140px] bg-base-200 hover:bg-base-300 hover:text-accent "
                  >
                    <PickDatabaseDialog datname={db.datname} users={users} />
                    {/* {db.datname} <ChevronRightSquare /> */}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}

interface DatabasesSuspenseProps {}

const dbs = Array.from({ length: 10 }, (_, i) => `db_${i}`);
export function DatabasesSuspenseFallBack({}: DatabasesSuspenseProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full min-h-[70vh] md:min-h-[40vh]  flex overflow-auto pb-5">
        <ul className="w-full  flex flex-wrap gap-2  px-4">
          {dbs &&
            dbs?.map((_, idx) => {
              return (
                <li
                  key={idx}
                  className="w-full  md:w-[35%] lg:w-[25%]  flex justify-center items-center skeleton
                     flex-grow rounded-lg h-[140px] bg-base-200 hover:bg-base-300 hover:text-accent "
                >
                  {/* <PickDatabaseDialog datname={db.datname} users={users} /> */}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
