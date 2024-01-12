import postgres from "postgres";
import { Redirect, usePageContext, useSSQ } from "rakkasjs";

interface OneTableRowsProps {
db_name:string;
db_table:string;
db_user:string;
db_password:string;
}
export function OneTableRows({db_name,db_table,db_password,db_user}:OneTableRowsProps){
const page_ctx = usePageContext()
    console.log(" ===  onetable rows params  === ",{ db_name, db_table, db_user, db_password });

  const query = useSSQ(async (ctx) => {
    try {
      const sql = postgres({
        host: "localhost",
        user: db_user!,
        password: db_password!,
        database: db_name!,
      });
      const rows =
        (await sql`SELECT * from ${ sql(db_table) }`) as any as [
          { [key: string]: any },
        ];
    //   console.log(" === tabless == ", rows);
      return { rows, error: null };
    } catch (error: any) {
      console.log(" === error == ", error.message);
      return { rows: null, error: error.message };
    }
  });
  
  if (query.data.error) {
      const redirect_url = page_ctx.url
    redirect_url.pathname = `pg/dbs/${db_name}`;
    return <Redirect href={redirect_url.toString()} />;
  }

//   console.log(" ===== table rows === ",query.data.rows);
const data = query.data.rows
if(!data){
  return (
  <div className="w-full h-full flex items-center justify-center">
    empty table 
  </div>)
}
return (
  <div className="w-full h-full flex items-center justify-center">
    <table className="w-full">
        <thead className="w-full">
          {Object.keys(data[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </thead>
        <tbody>

        {data?.map((row) => (
          <tr key={row.id}>
            {Object.keys(row).map((key) => {
            const cell = row[key]
            if(typeof cell === "object"){
              return(
                <td key={key}>{JSON.stringify(cell)}</td>
              )
            }
            return(
              <td key={key}>{row[key]}</td>
            )})}
          </tr>
        ))}
        </tbody>
    </table>
  </div>
);
}
