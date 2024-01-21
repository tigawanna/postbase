import { PageProps, Redirect } from "rakkasjs";
import { OneTableColmunTyoes } from "./components/OneTableColmunTyoes";
export default function OneTableTypesPage({ params, url }: PageProps) {
  const db_name = params.db;
  const db_table = params.table;
  const db_user = url.searchParams.get("name");
  const db_password = url.searchParams.get("password");
  const db_primary_column = url.searchParams.get("column");

  if (!db_name || !db_table || !db_user || !db_password || !db_primary_column) {
    //   console.log(" ==== one table missing params redirecting  === ", {
    //     db_name,
    //     db_table,
    //     db_user,
    //     db_password,
    //   });
    const redirect_url = url;
    redirect_url.pathname = `pg/${db_name}`;
    return <Redirect href={redirect_url.toString()} />;
  }
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center">
      <OneTableColmunTyoes db_table={db_table} />
    </div>
  );
}
