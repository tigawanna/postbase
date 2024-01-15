import { PageProps, Redirect } from "rakkasjs";
import { OneTableRows } from "./components/OneTableRows";
export default function OneTablePage({ params, url }: PageProps) {
//   console.log(" ===  params === ", params);

  const db_name = params.db;
  const db_table = params.table;
  const db_user = url.searchParams.get("name");
  const db_password = url.searchParams.get("password");
  const db_primary_column = url.searchParams.get("column");

    console.log(" ===  onetable rows params  === ", {
      db_name,
      db_table,
      db_user,
      db_password,
      db_primary_column,
    });

  if (!db_name || !db_table || !db_user || !db_password || !db_primary_column) {
    // console.log(" ==== one table missing params === ",{db_name,db_table,db_user,db_password});
    const redirect_url = url;
    redirect_url.pathname = `pg/dbs/${db_name}`;
    return <Redirect href={redirect_url.toString()} />;
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center ">
      <div className="text-4xl font-bold w-full h-fit text-center p-2 bg-base-300">
        {params.table} table
      </div>
      <OneTableRows
        db_name={db_name}
        db_table={db_table}
        db_user={db_user}
        db_password={db_password}
        db_primary_column={db_primary_column}
      />
    </div>
  );
}
