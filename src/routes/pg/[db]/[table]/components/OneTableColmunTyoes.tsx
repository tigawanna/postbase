import { useSSM, useSSQ } from "rakkasjs";
import { pascal } from "radash";
import { codeToHtml } from "shikiji";
import { getTextFromFileWithImports } from "@/utils/helpers/fs";
import { CopyToClipBoard } from "@/components/form/copy";
import { existsSync } from "fs";
import { GenerateTableTypesDialog } from "./GenerateTypesDialog";
import kanel from "kanel";
import { DbAuthProps, postgresInstance } from "@/lib/pg/pg";
import { safeDestr } from "destr";
import { Button } from "@/components/shadcn/ui/button";
import { CloudCog, Loader } from "lucide-react";
import { hotToast } from "@/utils/helpers/toast";
const { processDatabase } = kanel;
interface OneTableColmunTyoesProps {
  db_table: string;
  db_name: string;
}

export function OneTableColmunTyoes({
  db_table,
  db_name,
}: OneTableColmunTyoesProps) {
  const query = useSSQ(async () => {
    try {
      if (!existsSync(`pg/${db_name}`)) {
        return {
          types: null,
          html: null,
          error: "Types not generated for this DB",
        } as const;
      }
      const all_types = await getTextFromFileWithImports(
        "pg/" + db_name + "/public/" + pascal(db_table) + ".ts",
        "",
      );

      if (!all_types) {
        return {
          types: null,
          html: null,
          error: "types for this table not found",
        } as const;
      }

      // console.log(" === readTextFromFileWithImports types  ==== ", all_types);
      const html = await codeToHtml(all_types, {
        lang: "typescript",
        theme: "catppuccin-mocha",
      });
      // console.log({ html });
      return { types: all_types, html, error: null } as const;
    } catch (error: any) {
      return { types: null, error: error.message } as const;
    }
  });

  const generate_types_mutation = useSSM(async (ctx) => {
    try {
      const config = safeDestr<DbAuthProps>(ctx.cookie?.pg_cookie);

      if (!config) {
        return { success: false, error: "no config" };
      }
      if (config.local_or_remote === "remote") {
        return { success: false, error: "remote not supported yet" };
      }
      const sql = postgresInstance(config);
      if (!sql) {
        return { success: false, error: "no config" };
      }
      const { database, user, host } = sql.options;
      const types = await processDatabase({
        connection: {
          database,
          user,
          host,
          password: config.db_password,
        },
        outputPath: "pg/" + db_name,
      });
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  if (
    query.data?.error &&
    query.data?.error === "Types not generated for this DB"
  ) {
    return (
      <div className="w-full  min-h-[70dvh] h-full flex flex-col gap-3 items-center justify-center ">
        <div className="p-5 rounded-lg bg-base-200 text-error">
          {query.data?.error}
        </div>

        <Button
          className="gap-3"
          onClick={() => {
            generate_types_mutation.mutateAsync().then((res) => {
              if(res.error){
                hotToast({
                  title: "Error generating types",
                  description: res.error,
                  type: "error",

                })
              }
            })
          }}
        >
          Generate types {generate_types_mutation.isLoading
            ? <Loader className="animate-spin" />
            : <CloudCog />}
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
        <div className="p-5 rounded-lg bg-base-200">no types found</div>
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
        <div className="w-full flex flex-col ">
          <code dangerouslySetInnerHTML={{ __html: query.data?.html }}></code>
        </div>
      </div>
    </div>
  );
}
