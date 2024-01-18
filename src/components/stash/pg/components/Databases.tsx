import postgres from "postgres";
import { useSSQ } from "rakkasjs";
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
        idle_timeout: 20,
        max_lifetime: 60 * 30,
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
    </div>
  );
}
