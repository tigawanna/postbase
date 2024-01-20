import { LookupHookResult, PageContext } from "rakkasjs";
import { safeDestr } from "destr";
import { DbAuthProps } from "@/lib/pg/pg";
import { parse } from "cookie-es";

export function pageGuard(ctx: PageContext): LookupHookResult {
  const pg_config = ctx.queryClient.getQueryData("pg_config");
  console.log(" ===========  pg_config in auth route guard ==============", pg_config);
  if (pg_config) {
    console.log(
      "==== auth route guard true redirecting to  ======= ",
      ctx.url.origin,
    );
    const redirect = ctx.url.searchParams.get("redirect");
    // const new_url = new URL(redirect ?? ctx.url.origin);
    // console.log("=============== new url ========= ", new_url);
    return {
      redirect: redirect ?? ctx.url.origin,
    };
  }
  // const new_url = ctx.url
  // new_url.searchParams.set("redirect", ctx.url.origin)

  return true;
}
