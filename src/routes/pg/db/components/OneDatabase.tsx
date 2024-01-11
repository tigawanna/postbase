import postgres from "postgres";
import { useSSQ } from "rakkasjs";

interface OneDatabaseProps {
  db_name: string;
  db_user: string;
  db_password: string;
}

export function OneDatabase({
  db_name,
  db_password,
  db_user,
}: OneDatabaseProps) {
  const query = useSSQ(async (ctx) => {
    try {
      const sql = postgres({
        host: "localhost",
        user: db_user!,
        password: db_password!,
        database: db_name!,
      });
      const tables =
        (await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'`) as any as [
          { table_name: string },
        ];
      // console.log(" === tabless == ", tables);
      return { tables, error: null };
    } catch (error: any) {
      console.log(" === error == ", error.message);
      return { tables: null, error };
    }
  });
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full flex flex-wrap items-center justify-center gap-2 px-2">
        {query?.data?.tables?.map((table) => (
          <div
            key={table.table_name}
            className="min-w-fit flex items-center justify-center bg-base-200 py-2 px-5 flex-grow hover:text-accent"
          >
            <h1 className="text-xl text-center w-full ">{table.table_name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
