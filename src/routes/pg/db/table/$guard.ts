
import { isString } from "@/utils/helpers/string";
import { LookupHookResult, PageContext } from "rakkasjs";

export function pageGuard(ctx: PageContext): LookupHookResult {
  const atble_param = ctx.url.pathname
  return true
  if (isString(atble_param)) {
    return true;
  } else {
    return {
      redirect:"/pg/db",
    };
  }
}
