import { postgresInstance } from "@/lib/pg/pg";
import postgres from "postgres";
import { PageProps, useSSQ } from "rakkasjs";
export default function TestPage({}: PageProps) {
  const query = useSSQ(async (ctx) => {
    try {
      const config = ctx.locals?.pg;
      console.log("use ssq cookies == ", ctx.cookie);
      console.log("config == ", config);
      if(!config){
        return { result: null, error: "pg config not found" };
      }
      const sql = postgresInstance(config);
      const users = (await sql`SELECT * FROM film`) as any as [
        { id: number; name: string },
      ];
      console.log("remote users ==== ", users);
    } catch (error) {
      console.log("Error == ", error);
      return { result: null, error };
    }
  });
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center">
      <p>test page</p>
    </div>
  );
}
