import { Avatar, AvatarFallback } from "@/components/shadcn/ui/avatar";
import { DbAuthProps, deletePGCookie, postgresInstance } from "@/lib/pg/pg";
import { safeDestr } from "destr";
import { navigate, usePageContext, useQueryClient, useSSM, useSSQ } from "rakkasjs";

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { Loader, Settings } from "lucide-react";
import { Button } from "@/components/shadcn/ui/button";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

interface DatabaseEmailProps {}

export function DatabaseConfig({}: DatabaseEmailProps) {

  const query = useSSQ((ctx) => {
    try {
      const config = safeDestr<DbAuthProps>(ctx.cookie?.pg_config);
      const sql = postgresInstance(config);
      const options = {
        user: sql?.options?.user,
        host: sql?.options?.host,
        database: sql?.options?.database,
      };
      return { config, options, error: null };
    } catch (error) {
      return { config: null, options: null, error };
    }
  });
const page_ctx = usePageContext()
  const qc = useQueryClient();
  const mutation = useSSM(async (ctx) => {
    try {
      ctx.deleteCookie("pg_cookie", {
        path: "/",
      });
      deletePGCookie(ctx);
      return { success: true, error: null };
    } catch (error: any) {
      console.log("======== error loggin out of db ======= ", error);
      return { success: false, error: error.message };
    }
  });

  const config = query.data?.config;
  const options = query.data?.options;

  if (!config) {
    return (
      <div className="w-full flex items-center justify-center">
        <DropdownMenuTrigger asChild>
          <Button className="relative h-7 w-7 rounded-full">
            <Avatar className="h-8 w-8">
              {/* <AvatarImage src={user?.avatar} alt="@shadcn" /> */}
              <AvatarFallback>
                <Settings />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-full "
          align="end"
          forceMount
        ></DropdownMenuContent>
      </div>
    );
  }
  if (config.local_or_remote === "remote") {
    return (
      <>
        <DropdownMenuTrigger asChild>
          <Button className="relative h-7 w-7 rounded-full">
            <Avatar className="h-8 w-8">
              {/* <AvatarImage src={user?.avatar} alt="@shadcn" /> */}
              <AvatarFallback>{options?.user?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit " align="end" forceMount>
          <DropdownMenuGroup>
            <DropdownMenuItem className="">
              database: {options?.database}
            </DropdownMenuItem>

            <DropdownMenuItem className="">
              host: {options?.host}
            </DropdownMenuItem>

            <DropdownMenuItem className="">
              user: {options?.user}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {/* theme toggle */}
          <ThemeToggle />
          <DropdownMenuSeparator />
          <Button className="relative h-7 w-7 rounded-full">Logout</Button>
        </DropdownMenuContent>
      </>
    );
  }

  return (
    <>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-7 w-7 rounded-full">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src={user?.avatar} alt="@shadcn" /> */}
            <AvatarFallback>{options?.user?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit" align="end" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem className="">
            database: {options?.database}
          </DropdownMenuItem>

          <DropdownMenuItem className="">
            host: {options?.host}
          </DropdownMenuItem>

          <DropdownMenuItem className="">
            user: {options?.user}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* theme toggle */}
        <ThemeToggle />
        <DropdownMenuSeparator />
        <Button
          onClick={() =>
            mutation.mutateAsync().then((res) => {
              const new_url = new URL(page_ctx.url);
              new_url.pathname = "/auth";
              new_url.searchParams.set("redirect", page_ctx.url.pathname);
              qc.setQueryData("pg_config", null);
              navigate(new_url.toString());
            })
          }
          disabled={mutation.isLoading}
          className="flex items-center justify-center gap-4"
        >
          Logout{" "}
          {mutation.isLoading && <Loader className="w-4 h-4 animate-spin" />}
        </Button>
      </DropdownMenuContent>
    </>
  );
}
