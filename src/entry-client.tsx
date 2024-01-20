/* eslint-disable no-var */
import { startClient } from "rakkasjs";

import { parse, serialize } from "cookie-es";
import { safeDestr } from "destr";
import { DbAuthProps } from "./lib/pg/pg";

startClient({
  hooks: {
    wrapApp(app) {
      return app;
    },
    beforeStart() {
      // Do something before starting the client
    },
    extendPageContext(ctx) {
      // if (document?.cookie) {
      //   const cookie = parse(document?.cookie);
      //   if (cookie) {
      //     const pg_config = safeDestr<DbAuthProps>(cookie?.pg_cookie);
       
      //     // console.log("  ===  entry-client pg_config =====", pg_config);
      //     ctx.locals.pg = pg_config;
      //     console.log("  ===  entry-client cooki_pg config =====", cookie,pg_config);
      //     ctx.queryClient.setQueryData("pg_config", pg_config);
      //   } else {
      //     console.log("  ===  entry-client no cookie =====");
      //     ctx.queryClient.setQueryData("pg_config", null);
      //     ctx.locals.pg = null;
      //   }
      // }

    },
  },
});
