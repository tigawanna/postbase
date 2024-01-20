import { RequestContext, createRequestHandler } from "rakkasjs";
import { cookie } from "@hattip/cookie";
import { safeDestr } from "destr";
import { DbAuthProps } from "./lib/pg/pg";

export async function pgConfigCheck(ctx: RequestContext<unknown>) {
  const pg_config = safeDestr<DbAuthProps>(ctx.cookie?.pg_config);
  if (!pg_config) {
    return {
      redirect: "/auth/",
    };
  }
}

export default createRequestHandler({
  middleware: {
    beforePages: [],
    beforeApiRoutes: [],
    beforeNotFound: [],
    beforeAll: [cookie()],
  },

  createPageHooks(requestContext) {
    let queries = Object.create(null);
    return {
      emitToDocumentHead() {
        const cookie_theme = requestContext?.cookie?.theme;
        return `
    <link rel="icon" type="image/svg+xml" href="/site.svg" />
    <script>
      (function() {
        document.documentElement.setAttribute("data-theme", "${cookie_theme}");
      })();
     </script>

  `;
      },

      async extendPageContext(ctx) {
        const request = ctx.requestContext?.request;
        if (!request) return;

        const cookie = requestContext.cookie;
        if (cookie?.pg_cookie) {
          // console.log("  ===  entry-hatip cookie =====", cookie.pg_cookie);
          const pg_config = safeDestr<DbAuthProps>(cookie?.pg_cookie);
          ctx.locals.pg = pg_config;
          ctx.queryClient.setQueryData("pg_config", pg_config);
          // console.log("  ===  entry-hatip pg_config =====",pg_config );
        }
      },

      wrapApp(app) {
        return app;
      },

      //   wrapSsrStream(stream) {
      //     const { readable, writable } = new TransformStream({
      //       transform(chunk, controller) {
      //         // You can transform the chunks of the
      //         // React SSR stream here.
      //         controller.enqueue(chunk);
      //       },
      //     });
      // // @ts-expect-error
      //     stream.pipeThrough(writable);

      //     return readable;
      //   },
    };
  },
});
