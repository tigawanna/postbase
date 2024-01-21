import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn/ui/alert-dialog";
import { CloudCog } from "lucide-react";
import { Button } from "@/components/shadcn/ui/button";
import { useSSM } from "rakkasjs";

import { DbAuthProps, postgresInstance } from "@/lib/pg/pg";
import { safeDestr } from "destr";

import pkg from "kanel";
const { processDatabase } = pkg;
interface GenerateTableTypesDialogProps {
  db_name: string;
  db_table: string;
}

export function GenerateTableTypesDialog({
  db_name,
  db_table,
}: GenerateTableTypesDialogProps) {
  const mutation = useSSM(async (ctx, vars) => {
    try {
      const config = safeDestr<DbAuthProps>(ctx.cookie?.pg_cookie);
      if (!config || !config?.local_or_remote) {
        return { success: false, error: "no config" };
      }
      if(config.local_or_remote==="remote"){
        return { success: false, error: "remote not supported yet" };
      }
      const sql = postgresInstance(config);
      if (!sql) {
        return { success: false, error: "no config" };
      }
      const {database,user,host} = sql.options
      const types = await processDatabase({
        connection: {
            database,
            user,
            host,
            password: config.db_password,
        },
        outputPath: "pg/" + db_name,
      });
    } catch (error:any) {
      return { success: false, error: error.message };
    }
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-3">
        Generate types <CloudCog />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">{db_name}</AlertDialogTitle>
          <AlertDialogDescription className="brightness-75">
            This will generate types for {db_name}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button
            onClick={() => {}}
            className=" rounded-lg px-5 py-1.5 bg-base-200 hover:bg-base-300 hover:text-sky-400 "
          >
            continue to {db_table}
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
