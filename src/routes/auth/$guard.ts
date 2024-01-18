import { LookupHookResult, PageContext } from "rakkasjs";
import { safeDestr } from "destr";
import { DbAuthProps } from "@/lib/pg/pg";

export function pageGuard(ctx: PageContext): LookupHookResult {

  // console.log("user in auth route  ====== ",user)
  const cookie = ctx.requestContext?.cookie
  const pg_config = cookie?.pg_config
  if (pg_config) {
    return {
      redirect:ctx.url.origin
    };
  }


  return true
}
