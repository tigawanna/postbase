import { LookupHookResult, PageContext } from "rakkasjs";
import { safeDestr } from "destr";
import { DbAuthProps } from "@/lib/pg/pg";
import { parse } from "cookie-es";

export function pageGuard(ctx: PageContext): LookupHookResult {

  // console.log("user in auth route  ====== ",user)
  const locals = ctx.locals;
  const pg_config = locals?.pg;
  // const pg_route_cookie_string = parse(document.cookie);
  // const pg_config = safeDestr<DbAuthProps>(pg_route_cookie_string?.pg_config);
  console.log("==== auth route guard locals ======= ", pg_config)
  if (pg_config) {
    console.log("==== auth route guard true redirecting to  ======= ",ctx.url.origin)
    return {
      redirect:ctx.url.origin
    };
  }
  // const new_url = ctx.url
  // new_url.searchParams.set("redirect", ctx.url.origin)
  
  return true
}
