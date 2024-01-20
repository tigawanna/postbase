import { PageProps, Redirect } from "rakkasjs";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/ui/tabs";
import { OneTableColmunTyoes } from "./components/OneTableColmunTyoes";
import { OneTableRowsOffsetPages } from "./components/OneTableRowsOffsetPages";
import { hotToast } from "@/utils/helpers/toast";

export default function OneTablePage({ params, url }: PageProps) {
  const db_name = params.db;
  const db_table = params.table;
  const db_primary_column = url.searchParams.get("column");

  if (!db_name || !db_table || !db_primary_column) {
    const error_message = ()=>{
      let missiing_fields = [];
      if(!db_name){
        missiing_fields.push("db_name")
      }
      if(!db_table){
        missiing_fields.push("db_table")
      }
      if(!db_primary_column){
        missiing_fields.push("db_primary_column")
      }
      return `missing fields ${missiing_fields.join(",")}`
    }
    console.log(" ==== one table missing params redirecting  === ", error_message())
    hotToast({
      title: "Error loading table",
      description: error_message(),
      type: "error",
      position: "bottom-center",
    })
    const redirect_url = url;
    redirect_url.pathname = `pg/dbs/${db_name}`;
    return <Redirect href={redirect_url.toString()} />;
  }

  return (
    <div className="w-full h-screen flex flex-col overflow-auto ">
      {/* <OneTableRowsOffsetPages
        db_name={db_name}
        db_table={db_table}
        db_primary_column={db_primary_column}
      /> */}

      <Tabs defaultValue="types" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="types">Types</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <OneTableRowsOffsetPages
            db_name={db_name}
            db_table={db_table}
            db_primary_column={db_primary_column}
          />
        </TabsContent>
        <TabsContent value="types">
          <OneTableColmunTyoes db_table={db_table} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
