import { getTextFromFileWithImports } from "@/utils/helpers/fs";
import { pascal } from "radash";
import { usePageContext, useSSQ } from "rakkasjs";
import { codeToHtml } from "shikiji/index.mjs";
import { existsSync } from "fs";
import { readFile,writeFile } from "fs/promises";
import path from "path";
import { Button } from "@/components/shadcn/ui/button";
import { DbAuthProps } from "@/lib/pg/pg";
import { hotToast } from "@/utils/helpers/toast";
import { safeDestr } from "destr";
import { Loader, CloudCog } from "lucide-react";
import { generateTypeORMTypeGrapQLClass } from "./api/generateTypeORMTypeGrapQLClass";
import { useSSM } from "rakkasjs";
import { CopyToClipBoard } from "@/components/form/copy";
import { trimOutCodeBlock } from "@/utils/helpers/string";
interface OneTypeORMTypeGraphqlTypesProps {
  db_table: string;
  db_name: string;
}

export function OneTypeORMTypeGraphqlTypes({
  db_table,
  db_name,
}: OneTypeORMTypeGraphqlTypesProps) {
// const types_class_path = `pg/${db_name}/${db_table}/TypeClass.ts`;
const types_class_path =
  "pg/" + db_name + "/public/" + pascal(db_table) + "TypeORMTypeGraphQLClass.ts";
  const page_ctx = usePageContext();
  const query = useSSQ(async () => {
    try {
      if (!existsSync(types_class_path)) {
        return {
          types: null,
          html: null,
          error: "Types class not found for this table",
        } as const;
      }
      const types_class = await readFile(types_class_path, "utf8");
      const html = await codeToHtml(types_class, {
        lang: "typescript",
        theme: "aurora-x",
      });

      if (!types_class) {
        return {
          types: null,
          html: null,
          error: "error reading types class",
        } as const;
      }

      // console.log({ html });
      return { types: types_class, html, error: null } as const;
    } catch (error: any) {
      return { types: null, error: error.message } as const;
    }
  });

  const generate_types_class_mutation = useSSM(async (ctx) => {
    try {
      const config = safeDestr<DbAuthProps>(ctx.cookie?.pg_cookie);

      if (!config) {
        return { success: false, error: "no config" };
      }
      const table_types = await getTextFromFileWithImports(
        "pg/" + db_name + "/public/" + pascal(db_table) + ".ts",
        "",
        db_name,
      );
      if (!table_types) {
        return {
          types: null,
          html: null,
          error: "types for this table not found",
        } as const;
      }
      const table_types_class =
        await generateTypeORMTypeGrapQLClass(table_types);

      if (!table_types_class) {
        return { success: false, error: "error generating types class" };
      }
      const fixed_output = trimOutCodeBlock(table_types_class);
      // if(table_types_class)
      await writeFile(types_class_path, fixed_output, "utf8");

    //   query.refetch();
    return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  if (
    query.data?.error &&
    query.data?.error === "Types class not found for this table"
  ) {
    return (
      <div className="w-full  min-h-[70dvh] h-full flex flex-col gap-3 items-center justify-center ">
        <div className="p-5 rounded-lg bg-base-200 text-error">
          {query.data?.error}
        </div>

        <Button
          className="gap-3"
          onClick={() => {
            generate_types_class_mutation.mutateAsync().then((res) => {
                // console.log("==== res =====",res);
              if (res.error) {
                hotToast({
                  title: "Error generating types",
                  description: res.error,
                  type: "error",
                });
              }
              if(res.success){
                hotToast({
                  title: "Types generated",
                  description: "types class generated",
                  type: "success",
                });
                query.refetch();

              }
            });
          }}
        >
          Generate typeorm class{" "}
          {generate_types_class_mutation.isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <CloudCog />
          )}
        </Button>
      </div>
    );
  }
  if (query.data?.error) {
    return (
      <div className="w-full min-h-[70dvh] h-full flex flex-col gap-3 items-center justify-center ">
        <div className="p-5 rounded-lg bg-base-200">{query.data?.error}</div>
      </div>
    );
  }
  if (!query.data?.html) {
    return (
      <div className="w-full min-h-[70dvh] h-full flex flex-col gap-3 items-center justify-center ">
        <div className="p-5 rounded-lg bg-base-200">no typeorm class found</div>
      </div>
    );
  }
  return (
    <div className="w-full max-h-[80vh] overflow-auto">
      <div className="w-full flex flex-col justify-end items-end">
        <CopyToClipBoard
          text={query.data?.types}
          className="sticky top-0 right-5 w-fit"
        />
        <div className="w-full flex flex-col px-4 ">
          <code dangerouslySetInnerHTML={{ __html: query.data?.html }}></code>
        </div>
      </div>
    </div>
  );
}
