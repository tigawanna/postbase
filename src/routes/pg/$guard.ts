import { LookupHookResult, PageContext } from "rakkasjs";
import { safeDestr } from "destr";
import { DbAuthProps } from "@/lib/pg/pg";

export function pageGuard(ctx: PageContext): LookupHookResult {
  // console.log(" ====== locals in auth route  ====== ",locals)
  // console.log("==== pg route guard document.cookie ======= ",document.cookie)
  // console.log("==== pg route guard ctx.requestContext?.cookie ======= ", ctx.requestContext?.cookie)
  // const pg_route_cookie_string = parse(document.cookie);
  // const pg_route_cookie = safeDestr<DbAuthProps>(pg_route_cookie_string?.pg_config);
  // console.log("==== pg route guard locals ======= ", pg_route_cookie)
  const locals = ctx.locals;
  const pg_config = locals?.pg;
  if (!pg_config) {
    return {
      redirect: "/auth",
    };
  }
  const user = safeDestr<DbAuthProps>(pg_config);
  if (user.local_or_remote === "remote") {
    if (user.connection_url == null) {
      return {
        redirect: "/auth",
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
      return {
        redirect: "/auth",
      };
    }
  }

  return true;
}
