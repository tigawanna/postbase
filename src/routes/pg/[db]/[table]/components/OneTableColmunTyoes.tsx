import { useSSQ } from "rakkasjs";
import { pascal } from "radash";
import { codeToHtml } from "shikiji";
import { getTextFromFileWithImports } from "@/utils/helpers/fs";
import { CopyToClipBoard } from "@/components/form/copy";

interface OneTableColmunTyoesProps {
  db_table: string;
}

export function OneTableColmunTyoes({ db_table }: OneTableColmunTyoesProps) {
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

      // const types = await fs.readFile(
      //   "pg/public/" + pascal(db_table) + ".ts",
      //   "utf-8",
      // );
      // console.log(" === types  ==== ", types);
      const all_types = await getTextFromFileWithImports(
        "pg/public/" + pascal(db_table) + ".ts",
        "",
      );

      if (!all_types) {
        return { types: null, html: null, error: null };
      }

      // console.log(" === readTextFromFileWithImports types  ==== ", all_types);
      const html = await codeToHtml(all_types, {
        lang: "typescript",
        theme: "catppuccin-mocha",
      });
      // console.log({ html });
      return { types: all_types, html, error: null };
    } catch (error: any) {
      return { types: null, error: error.message };
    }
  });
  //   console.log(" =========== query.data =========== ", query.data);

  if (!query.data?.html) {
    return (
      <div className="w-full h-full flex flex-col gap-3 items-center justify-center ">
        <div className="p-10 rounded-lg bg-base-200">no types found</div>
      </div>
    );
  }
  return (
    <div className="w-full max-h-[80vh] overflow-auto">
      <div className="w-full flex flex-col justify-end items-end">
        <CopyToClipBoard text={query.data?.types} className="sticky top-0 right-5 w-fit"/>
      <div className="w-full flex flex-col ">

        <code dangerouslySetInnerHTML={{ __html: query.data?.html }}></code>
      </div>
      </div>
    </div>
  );
}
