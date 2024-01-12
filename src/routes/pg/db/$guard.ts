
import { isString } from "@/utils/helpers/string";
import { LookupHookResult, PageContext } from "rakkasjs";

export function pageGuard(ctx: PageContext): LookupHookResult {
  
  const db_name = ctx.url.pathname;
  const db_user = ctx.url.searchParams.get("name");
  const db_password = ctx.url.searchParams.get("password");

  if (!db_name || !db_user || !db_password) {
    return {
      redirect: "/pg/db",
    };
  }
  return true

}
