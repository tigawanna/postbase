import { RequestContext, createRequestHandler } from "rakkasjs";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { uneval } from "devalue";
import { cookie } from "@hattip/cookie";
import { safeDestr } from "destr";
import { DbAuthProps } from "./lib/pg/pg";


export async function beforePageLuciaMiddleware(ctx: RequestContext<unknown>) {}

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
      emitBeforeSsrChunk() {
        if (Object.keys(queries).length === 0) return "";

        // Emit a script that calls the global $TQS function with the
        // newly fetched query data.

        const queriesString = uneval(queries);
        queries = Object.create(null);
        return `<script>$TQS(${queriesString})</script>`;
      },

      emitToDocumentHead() {
        const cookie_theme = requestContext?.cookie?.theme;
        return `
    <link rel="icon" type="image/svg+xml" href="/site.svg" />
    <script>
      (function() {
        document.documentElement.setAttribute("data-theme", "${cookie_theme}");
      })();
     </script>
     <script>$TQD=Object.create(null);$TQS=data=>Object.assign($TQD,data);</script>
  `;
      },

      async extendPageContext(ctx) {
        const request = ctx.requestContext?.request;
        if (!request) return;


        const cookie = requestContext.cookie;
        if (cookie?.pg_config) {
          console.log("  ===  entry-hatip cookie =====", cookie.pg_config);
          const pg_config = safeDestr<DbAuthProps>(cookie?.pg_config);
          // console.log("  ===  entry-hatip pg_config =====", pg_config);
          ctx.locals.pg = pg_config;
          console.log("  ===  entry-hatip locals.pg =====", ctx.locals.pg);
        }
      },

      wrapApp(app) {
        const queryCache = new QueryCache({
          onSuccess(data, query) {
            queries[query.queryHash] = data;
          },
        });

        const queryClient: QueryClient = new QueryClient({
          mutationCache: new MutationCache({
            onSuccess: async (data, variable, context, mutation) => {
              if (Array.isArray(mutation.meta?.invalidates)) {
                return queryClient.invalidateQueries({
                  queryKey: mutation.meta?.invalidates,
                });
              }
            },
          }),
          queryCache,
          defaultOptions: {
            queries: {
              staleTime: Infinity,
              refetchOnWindowFocus: false,
              refetchOnReconnect: false,
            },
          },
        });

        return (
          <QueryClientProvider client={queryClient}>{app}</QueryClientProvider>
        );
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
