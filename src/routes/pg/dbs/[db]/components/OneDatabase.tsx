import postgres from "postgres";
import { Link, Redirect, navigate, usePageContext, useSSQ } from "rakkasjs";
import { useEffect } from "react";

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
  const page_ctx = usePageContext();
  const table_url = page_ctx.url;
  
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
      // console.log(" === error == ", error.message);
      return { tables: null, error: error.message };
    }
  });

  if (query.data.error) {
    return <Redirect href="/pg/dbs" />;
  }

  return (
    <div className="w-full h-full flex flex-col  items-center gap-2">
      <div className="text-4xl font-bold p-2">{db_name}</div>
      <div className="w-full h-full flex flex-col  items-center  gap-2 mt-[10%]">
        <div className="w-full flex flex-wrap items-center justify-center gap-2 px-2">
          {query?.data?.tables?.map((table) => {
            table_url.pathname = `/pg/dbs/${db_name}/${table.table_name}`;
            return (
              <Link
                key={table.table_name}
                href={table_url.toString()}
                className="min-w-fit flex items-center justify-center bg-base-200 py-2 px-5 flex-grow hover:text-accent"
              >
                <h1 className="text-lg text-center w-full ">
                  {table.table_name}
                </h1>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
