import { Card } from "@/components/shadcn/ui/card";
import postgres from "postgres";

import { Link, useSSQ } from "rakkasjs";
import { PickDatabaseDialog } from "./PickDatabaseDialog";
interface DatabasesProps {}

export function Databases({}: DatabasesProps) {
  const query = useSSQ(async (ctx) => {
    try {
      const sql = postgres({
        host: "localhost",
        user: "postgres",
        password: "postgres",
        database: "postgres",
      });
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
  return (
    <div className="w-full h-full flex flex-col gap-5 ">
      <h1 className="text-3xl font-bold text-center w-full ">Databases</h1>
      <div className="w-full min-h-[70vh] md:min-h-[40vh] h-fit flex items-center justify-center">
        <ul className="w-full  flex flex-wrap gap-2 items-center justify-center px-4">
          {dbs &&
            dbs?.map((db: { datname: string }) => {
              return (
                <li className=" bg-base-200 min-w-[30%] flex flex-col justify-center
                 flex-grow py-0.5 px-2 gap-5 rounded-lg">
                  <div className="w-full text-2xl font-bold text-center">{db.datname}</div>
                  <PickDatabaseDialog datname={db.datname} users={users}/>
                </li>
                // <Link
                //   href={`/pg/${db.datname}`}
                //   className="p-5 flex-grow  text-2xl bg-base-200 rounded-lg hover:bg-base-300 hover:text-sky-400 "
                //   key={db.datname}
                // >
                //   {db.datname}
                // </Link>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
