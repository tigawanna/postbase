
import postgres from "postgres";
import { PageProps, useSSQ } from "rakkasjs"
export default function OneDatabasePage({}:PageProps) {
      const query = useSSQ(async (ctx) => {
        try {
            const sql = postgres({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "postgres",
  
});
          const database =
            (await sql`SELECT datname FROM pg_database`) as any as [
              { datname: string },
            ];
          //   console.log(" === databases == ", database);
          return { database, error: null };
        } catch (error: any) {
          console.log(" === error == ", error.message);
          return { database: null, error };
        }
      });
return (
<div className="w-full h-full min-h-screen flex items-center justify-center">

</div>
)}
