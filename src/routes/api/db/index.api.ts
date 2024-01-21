import { RequestContext } from "rakkasjs";
import { json } from "@hattip/response";
import postgres from "postgres";
import { DbAuthProps } from "@/lib/pg/pg";

export async function get(ctx: RequestContext) {
  ctx.setCookie("test-key", "value");
  return json({
    message: "nice job",
  });
}
export async function post(ctx: RequestContext) {
  try {
    const input = (await ctx.request.json()) as DbAuthProps;
    if (input.local_or_remote === "remote") {
      if (!input.connection_url == null) {
        const res = { result: null, error: "connection_url is required" };
        return json(res, { status: 400 });
      }
      const sql = postgres(input.connection_url, {
        idle_timeout: 20,
        max_lifetime: 60 * 30,
      });
      const database = (await sql`SELECT datname FROM pg_database`) as any as [
        { datname: string },
      ];
      console.log(" === succesfull local postgres connection == ", database);
      ctx?.setCookie("pg_cookie", JSON.stringify(input));
      const res = { result: { database }, error: null };
      return json(res);
    }
    // console.log(" ===  cookie ==== ", ctx.cookie);
    // console.log(" ===  setCookie ==== ", ctx.setCookie);
    if(!input.db_host == null) {
      const res = { result: null, error: "db_host is required" };
      return json(res, { status: 400 });
    }
    if(!input.db_user == null) {
      const res = { result: null, error: "db_user is required" };
      return json(res, { status: 400 });
    }
    if(!input.db_password == null) {
      const res = { result: null, error: "db_password is required" };
      return json(res, { status: 400 });
    }
    if(!input.db_name == null) {
      const res = { result: null, error: "db_name is required" };
      return json(res, { status: 400 });
    }
    const sql = postgres({
      host: input.db_host,
      user: input.db_user,
      password: input.db_password,
      database: input.db_name,
      idle_timeout: 20,
      max_lifetime: 60 * 30,
    });
    const database = (await sql`SELECT datname FROM pg_database`) as any as [
      { datname: string },
    ];
    console.log(" === succesfull local postgres connection == ", database);
    ctx?.setCookie("pg_cookie", JSON.stringify(input));
    const res = { result: { database }, error: null };
    return json(res);
  } catch (error: any) {
    console.log(" === local postgres connection error == ", error.message);
    // ctx?.deleteCookie("pg_config");
    return json({ result: null, error: error.message }, { status: 500 });
  }
}
