import { PageProps, Redirect } from "rakkasjs";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/ui/tabs";
import { OneTableColmunTyoes } from "./components/OneTableColmunTyoes";
import { OneTableRowsOffsetPages } from "./components/OneTableRowsOffsetPages";

export default function OneTablePage({ params, url }: PageProps) {
  const db_name = params.db;
  const db_table = params.table;
  const db_primary_column = url.searchParams.get("column");
 
  if (!db_name || !db_table || !db_primary_column) {
    const redirect_url = url;
    redirect_url.pathname = `pg/dbs/${db_name}`;
    return <Redirect href={redirect_url.toString()} />;
  }

  return (
    <div className="w-full h-screen flex flex-col ">
      <OneTableRowsOffsetPages
        db_name={db_name}
        db_table={db_table}
        db_primary_column={db_primary_column}
      />

      {/* <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="types">Types</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          list
          <OneTableRowsOffsetPages
            db_name={db_name}
            db_table={db_table}
            db_user={db_user}
            db_password={db_password}
            db_primary_column={db_primary_column}
          />
        </TabsContent>
        <TabsContent value="types">
          <OneTableColmunTyoes
            db_name={db_name}
            db_table={db_table}
            db_user={db_user}
            db_password={db_password}
            db_primary_column={db_primary_column}
          />
        </TabsContent>
      </Tabs> */}
    </div>
  );
}
