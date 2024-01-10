import postgres from "postgres";
import { PageProps, useSSQ } from "rakkasjs";
export default function OneDatabasePage({ params, url }: PageProps) {
  const db_name = params.id;
  const db_user = url.searchParams.get("name");
  const db_password = url.searchParams.get("password");

  const query = useSSQ(async (ctx) => {
    try {
      const sql = postgres({
        host: "localhost",
        user:db_user!,
        password:db_password!,
        database:db_name!,
      });
      const tables =
        (await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'`) as any as [
          { table_name: string },
        ];
        console.log(" === tabless == ", tables);
      return { tables, error: null };
    } catch (error: any) {
      console.log(" === error == ", error.message);
      return { tables: null, error };
    }
  });
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center"></div>
  );
}
