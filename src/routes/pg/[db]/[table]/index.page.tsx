import { PageProps, Redirect, navigate } from "rakkasjs";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/ui/tabs";
import { OneTableColmumnTypes } from "./components/OneTableColmumnTypes";
import { OneTableRowsOffsetPages } from "./components/OneTableRowsOffsetPages";
import { hotToast } from "@/utils/helpers/toast";
import { useState, useTransition } from "react";
import { OneTypeORMTypeGraphqlTypes } from "./components/OneTypeORMTypeGraphqlTypes";

export default function OneTablePage({ params, url }: PageProps) {
  const db_name = params.db;
  const db_table = params.table;
  const db_primary_column = url.searchParams.get("column");
  const table_tab = url.searchParams.get("tab") ?? "list";
  const  [currenttab,setCurrentTab]=useState(table_tab??"rows")
  const [,startTransition]=useTransition()

  function updtaeCurrentTab(tab:string){
    const new_url = new URL(url);
    new_url.searchParams.set("tab", tab);
    startTransition(()=>{
      navigate(new_url.toString())
      setCurrentTab(tab)
    })
  }

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
    // console.log(" ==== one table missing params redirecting  === ", error_message())
    hotToast({
      title: "Error loading table",
      description: error_message(),
      type: "error",
      position: "bottom-center",
      duration:4000
    })
    const redirect_url = url;
    redirect_url.pathname = `pg/${db_name}`;
    return <Redirect href={redirect_url.toString()} />;
  }

  return (
    <div className="w-full h-screen flex flex-col overflow-auto ">
      <Tabs
        defaultValue={currenttab}
        value={currenttab}
        onValueChange={updtaeCurrentTab}
        className="w-full"
      >
        <TabsList className="grid w-full  gap-2 grid-cols-3">
          <TabsTrigger className="" value="list">List</TabsTrigger>
          <TabsTrigger value="types">Types</TabsTrigger>
          <TabsTrigger value="typeorm">TypeORM + TypeGraphQL</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <OneTableRowsOffsetPages
            db_name={db_name}
            db_table={db_table}
            db_primary_column={db_primary_column}
          />
        </TabsContent>
        <TabsContent value="types">
          <OneTableColmumnTypes db_table={db_table} db_name={db_name} />
        </TabsContent>
        <TabsContent value="typeorm">
          <OneTypeORMTypeGraphqlTypes db_table={db_table} db_name={db_name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
