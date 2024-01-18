import { LookupHookResult, PageContext } from "rakkasjs";
import { safeDestr } from "destr";
import { DbAuthProps } from "@/lib/pg/pg";

export function pageGuard(ctx: PageContext): LookupHookResult {

  // console.log("user in auth route  ====== ",user)
  const locals = ctx.locals
  console.log("==== test route guard locals ======= ",locals)
  const pg_config = locals.pg
  if (!pg_config) {
    return {
      redirect: "/auth"
    };
  }
  const user = safeDestr<DbAuthProps>(pg_config);
  if (user.local_or_remote === "remote") {
    if (user.connection_url == null) {
      return {
        redirect: "/auth"
      };
    }
  }
  if (user.local_or_remote === "local") {
    if (user.db_name == null || user.db_password == null || user.db_user == null || user.db_host == null) {
      return {
        redirect: "/auth"
      };
    }
  }

  return true
}
