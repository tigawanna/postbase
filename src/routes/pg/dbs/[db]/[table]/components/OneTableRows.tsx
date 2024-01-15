import { useInfiniteQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import postgres from "postgres";
import { Redirect, runServerSideQuery, usePageContext, useRequestContext, useSSQ } from "rakkasjs";

interface OneTableRowsProps {
  db_name: string;
  db_table: string;
  db_user: string;
  db_password: string;
  db_primary_column:string;
}
export function OneTableRows({
  db_name,
  db_table,
  db_primary_column,
  db_password,
  db_user,
}: OneTableRowsProps) {
  const page_ctx = usePageContext();
  const ctx = useRequestContext();
  // console.log(" ===  onetable rows params  === ", {
  //   db_name,
  //   db_table,
  //   db_user,
  //   db_password,
  //   db_primary_column
  // });
// runServerSideQuery
interface GetTableRowsProps {
  cursor?: string
}
async function getTableRows({cursor}:GetTableRowsProps){
return runServerSideQuery(ctx,
  async (ctx) => {
    try {
      const sql = postgres({
        host: "localhost",
        user: db_user!,
        password: db_password!,
        database: db_name!,
      });
       const rows = (await sql`
      SELECT * from ${sql(db_table)} 
      LIMIT 10`) as any as [{ [key: string]: any }];
      //   console.log(" === tabless == ", rows);
      return { rows, error: null };
    } catch (error: any) {
      console.log(" === error == ", error.message);
      return { rows: null, error: error.message };
    }
},{
  uniqueId:"db-table-rows",
})
}

const query = useSuspenseInfiniteQuery({
  queryKey: ["table", db_name, db_table, db_primary_column],
    queryFn: async ({ pageParam}) => {
    return getTableRows({})
  },
  initialPageParam:"",
  getNextPageParam: (lastPage) => {
    // @ts-expect-error
    const last_page_item = lastPage?.rows[lastPage?.rows.length - 1]
    const next = last_page_item?.[db_primary_column]??""
    console.log("nextPage", next)
    console.log("lastPage", lastPage?.rows)
    return next
  },

})

  const query2 = useSSQ(async (ctx) => {
    try {
      const sql = postgres({
        host: "localhost",
        user: db_user!,
        password: db_password!,
        database: db_name!,
      });
      const rows = (await sql`
      SELECT * from ${sql(db_table)} 
      LIMIT 10`
      ) as any as [
        { [key: string]: any },
      ];
      //   console.log(" === tabless == ", rows);
      return { rows, error: null };
    } catch (error: any) {
      console.log(" === error == ", error.message);
      return { rows: null, error: error.message };
    }

  });

const rows = query.data.pages.flatMap((page) => page.rows);

  // if (query.data) {
  //   const redirect_url = page_ctx.url;
  //   redirect_url.pathname = `pg/dbs/${db_name}`;
  //   return <Redirect href={redirect_url.toString()} />;
  // }

  //   console.log(" ===== table rows === ",query.data.rows);
  // const data = query.data.rows;
  if (!rows) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        empty table
      </div>
    );
  }
  return (
    <div className="w-full h-screen overflow-auto">
      <table className="w-full table ">
        <thead className="sticky top-0 ">
     {rows[0]&&<tr className="text-lg ">
            {Object.keys(rows[0]).map((key,idx) => (
              <th className="bg-base-300 " key={key+idx}>
                {key}
              </th>
            ))}
          </tr>}
        </thead>
        <tbody>
          {rows.map((row:any, idx:any) => {
           
            const row_key = JSON.stringify(row??{});
            return (
              <tr key={row_key + idx} className="hover:bg-base-300">
                {Object.values(row).map((value, idx) => {
                 if(!value){
                    return
                  }
                  if (typeof value === "object" || Array.isArray(value)) {
                    return (
                      <td className="" key={row_key + JSON.stringify(value) + idx}>
                        {JSON.stringify(value)}
                      </td>
                    );
                  }
                  return (
                <td className="" key={row_key + value + idx}>
                      {/*@ts-expect-error */}
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
