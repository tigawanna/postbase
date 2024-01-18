import postgres from "postgres";
import { Redirect, usePageContext, useSSQ } from "rakkasjs";
import { PickTableColumnDialog } from "./PickTableColumn";

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
        idle_timeout: 20,
        max_lifetime: 60 * 30,
      });
      const tables = (await sql`
        SELECT table_name,
    (SELECT string_agg(column_name, ', ')
    FROM information_schema.columns
    WHERE table_schema = t.table_schema
        AND table_name = t.table_name) AS columns,
    (SELECT string_agg(data_type, ', ')
    FROM information_schema.columns
    WHERE table_schema = t.table_schema
        AND table_name = t.table_name) AS column_types
    FROM information_schema.tables t
  WHERE table_schema = 'public';

        `) as any as [
        {
          table_name: string;
          columns: string;
          column_types: string;
        },
      ];

      return { tables, error: null };
    } catch (error: any) {
      // console.log(" === error == ", error.message);
      return { tables: null, error: error.message };
    }
  });

  if (query.data.error) {
    return <Redirect href="/pg/dbs" />;
  }
  // console.log(" === tabless == ", query.data.tables);

  return (
    <div className="w-full flex flex-col  items-center gap-2 overflow-y-scroll h-screen">
      <div className="text-4xl font-bold p-2">{db_name}</div>
      <div className="w-full h-full flex flex-col  items-center  gap-2 mt-[10%]">
        <div className="w-full flex flex-wrap items-center justify-center gap-2 px-2 pb-8">
          {query?.data?.tables?.map((table) => {
            const columns = table.columns.split(",");
            const column_types = table.column_types.split(",");
            const combined_columns = columns.map((column, index) => {
              return `${column} (${column_types[index].trim()})`;
            });
            return (
              <div
                key={table.table_name}
                // href={table_url.toString()}
                className="min-w-fit flex flex-col  bg-base-200 rounded-xl shadow-base-100 
                shadow-lg p-4  flex-grow hover:bg-base-300 gap-3"
              >
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold ">{table.table_name}</h1>
                  <PickTableColumnDialog
                    // table_url={table_url}
                    db_name={db_name}
                    table_name={table.table_name}
                    columns={columns}
                  />
                </div>

                <ul className="divide-y gap-0.5">
                  {combined_columns.map((column) => {
                    return (
                      <li className="" key={column}>
                        {column}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
