import { useSSQ } from "rakkasjs";
import fs from "fs/promises";
import { pascal } from "radash";
import { codeToHtml } from "shikiji";

interface OneTableColmunTyoesProps {
  db_name: string;
  db_table: string;
  db_user: string;
  db_password: string;
  db_primary_column: string;
}

export function OneTableColmunTyoes({
  db_name,
  db_password,
  db_primary_column,
  db_table,
  db_user,
}: OneTableColmunTyoesProps) {
  const query = useSSQ(async () => {
    try {
      // const types = await processDatabase({
      //     connection:{
      //         database: db_name,
      //         host:"localhost",
      //         password: db_password,
      //         user: db_user
      //     },
      //     outputPath:"pg"
      
    // })
    const list_of_files  = await fs.readdir("pg/public")
    console.log(" === list of files === ", list_of_files)
    const types = await fs.readFile(
        "pg/public/" + pascal(db_table) + ".ts",
        "utf-8",
      );


      console.log(" === types  ==== ", types);
      const html = await codeToHtml(types, {
        lang: "typescript",
        theme: "catppuccin-mocha",
      });
      console.log({html})
      return { types: types, html, error: null };
    } catch (error: any) {
      return { types: null, error: error.message };
    }
  });
//   console.log(" =========== query.data =========== ", query.data);

  if (!query.data?.html) {
    return null;
  }
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center ">
      <h1 className="text-2xl font-bold">do type generation here</h1>
      <div className="p-10 rounded-lg bg-base-200">

        <code dangerouslySetInnerHTML={{ __html: query.data?.html }}></code>
      </div>
    </div>
  );
}

