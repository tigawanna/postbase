import { LookupHookResult, PageContext } from "rakkasjs";

export function pageGuard(ctx: PageContext): LookupHookResult {

  // console.log("user in auth route  ====== ",user)
  const cookie =  ctx.requestContext?.cookie
  console.log(" ==  guard cookie === ",cookie)
  if (true) {
    return true;
  } else {
    return {
      redirect: ctx.url.origin,
    };
  }
}
