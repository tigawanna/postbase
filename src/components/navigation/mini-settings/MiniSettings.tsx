import { Avatar, AvatarFallback } from "@/components/shadcn/ui/avatar";
import { Button } from "@/components/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { DbAuthProps, postgresInstance } from "@/lib/pg/pg";
import { safeDestr } from "destr";
import {
  Redirect,
  usePageContext,
  useSSM,
  useSSQ,
} from "rakkasjs";
import { Loader } from "lucide-react";

interface MiniSettingsModalProps {}

export function MiniSettingsModal({}: MiniSettingsModalProps) {
  const page_ctx = usePageContext();

  const query = useSSQ((ctx) => {
    try {
      const config = safeDestr<DbAuthProps>(ctx.cookie?.pg_cookie);
      const sql = postgresInstance(config);
          if (!sql) {
            return { result: null, error: "no config" };
          }

      const options = {
        user: sql?.options?.user,
        host: sql?.options?.host,
        database: sql?.options?.database,
      };
      // console.log("options  ==  ", options);
      return { config, options, error: null };
    } catch (error: any) {
      return { config: null, options: null, error: error.message };
    }
  });

  const mutation = useSSM(async (ctx, vars: { config: DbAuthProps }) => {
    try {
      const sql = postgresInstance(vars.config);
          if (!sql) {
            return { result: null, error: "no config" };
          }

      await sql.end();
      ctx.deleteCookie("pg_config", {
        path: "/",
      });
      // console.log(" ctx.cookie  === ", ctx.cookie);
      // console.log("======= loogged out of db ,deleted cookie =======");
      return { success: true, error: null };
    } catch (error: any) {
      // console.log("======== error loggin out of db ======= ", error);
      return { success: false, error: error.message };
    }
  });
  const config = query.data?.config;
  const options = query.data?.options;
  if (mutation.data?.success) {
    const new_url = new URL(page_ctx.url);
    new_url.pathname = "/auth";
    new_url.searchParams.set("redirect", page_ctx.url.pathname);
    return <Redirect href={new_url.toString()} />;
  }

  if (!config) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-7 w-7 rounded-full">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src={user?.avatar} alt="@shadcn" /> */}
            <AvatarFallback>{options?.user?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuLabel className="font-bold text-xl">
          connected database
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="bg-base-300">
          <DropdownMenuItem>database: {options?.database}</DropdownMenuItem>
          <DropdownMenuItem>user: {options?.user}</DropdownMenuItem>

          <Button
            onClick={() => mutation.mutate({ config })}
            disabled={mutation.isLoading}
            className=""
          >
            Logout{" "}
            {mutation.isLoading && <Loader className="w-4 h-4 animate-spin" />}
          </Button>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
