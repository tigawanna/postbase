import { LookupHookResult, PageContext } from "rakkasjs";


export function pageGuard(ctx: PageContext): LookupHookResult {
  const pg_config = ctx.queryClient.getQueryData("pg_cookie");
  // console.log("===  auth route guard url ===== ",ctx.url)
  if (pg_config) {
  const redirect = ctx.url.searchParams.get("redirect");
    return {
      redirect: redirect ?? ctx.url.origin,
    };
  }
  return true;
}
