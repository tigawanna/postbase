import { LookupHookResult, PageContext } from "rakkasjs";
import { safeDestr } from "destr";
import { DbAuthProps } from "@/lib/pg/pg";
import { parse } from "cookie-es";

export function pageGuard(ctx: PageContext): LookupHookResult {
  // console.log(" ====== locals in auth route  ====== ",locals)
  // console.log("==== pg route guard document.cookie ======= ",document.cookie)
  // console.log("==== pg route guard ctx.requestContext?.cookie ======= ", ctx.requestContext?.cookie)
  const pg_route_cookie_string = parse(document.cookie);
  const pg_config = safeDestr<DbAuthProps>(pg_route_cookie_string?.pg_config);
  console.log("==== test route guard locals ======= ", pg_config)
  console.log(" === test rour guard URL object  ===== ",ctx.url)
  // const locals = ctx.locals;
  // const pg_config = locals?.pg;
  if (!pg_config) {
    const new_url = new URL(ctx.url)
    new_url.pathname = "/auth";
    new_url.searchParams.set("redirect", ctx.url.pathname);
    console.log("   ====  test_config not found  ===== ")
    return {
      redirect: new_url.toString(),
    };
  }

  const user = safeDestr<DbAuthProps>(pg_config);
  if (user.local_or_remote === "remote") {
    if (user.connection_url == null) {
      const new_url = new URL(ctx.url)
      new_url.pathname = "/auth";
      new_url.searchParams.set("redirect", ctx.url.pathname);
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
      const new_url = new URL(ctx.url)
      new_url.pathname = "/auth";
      new_url.searchParams.set("redirect", ctx.url.pathname);
      return {
        redirect: new_url.toString(),
      };
    }
  }

  return true;
}
