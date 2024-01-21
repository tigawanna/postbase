import { LookupHookResult, PageContext } from "rakkasjs";
import { safeDestr } from "destr";
import { DbAuthProps } from "@/lib/pg/pg";

export function pageGuard(ctx: PageContext): LookupHookResult {
  const pg_config = ctx.queryClient.getQueryData(
    "pg_config",
  ) as DbAuthProps | null;

  if (!pg_config) {
    const new_url = new URL(ctx.url);
    new_url.pathname = "/auth";
    new_url.searchParams.set("redirect", ctx.url.pathname + ctx.url.search);
    console.log("   ==== test auth guard pg_config not found  ===== ");
    return {
      redirect: new_url.toString(),
    };
  }

  const user = safeDestr<DbAuthProps>(pg_config);
  if (user.local_or_remote === "remote") {
    if (user.connection_url == null) {
      const new_url = new URL(ctx.url);
      new_url.pathname = "/auth";
      new_url.searchParams.set("redirect", ctx.url.pathname + ctx.url.search);
      return {
        redirect: new_url.toString(),
      };
    }
  }
  if (user.local_or_remote === "local") {
    if (
      user.db_name == null ||
      user.db_password == null ||
      user.db_user == null ||
      user.db_host == null
    ) {
      const new_url = new URL(ctx.url);
      new_url.pathname = "/auth";
      new_url.searchParams.set("redirect", ctx.url.pathname + ctx.url.search);
      return {
        redirect: new_url.toString(),
      };
    }
  }

  return true;
}
