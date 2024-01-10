/* eslint-disable no-var */
import { startClient } from "rakkasjs";
import { QueryClientProvider, QueryClient, MutationCache } from "@tanstack/react-query";




const queryClient:QueryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: async (data, variable, context, mutation) => {
      if (Array.isArray(mutation.meta?.invalidates)) {
        return queryClient.invalidateQueries({
          queryKey: mutation.meta?.invalidates,
        });
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 100,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

function setQueryData(data: Record<string, unknown>) {
  for (const [key, value] of Object.entries(data)) {
    queryClient.setQueryData(JSON.parse(key), value, { updatedAt: Date.now() });
  }
}
declare global {
  var $TQD: Record<string, unknown> | undefined;
  var $TQS: typeof setQueryData;
}

// Insert data that was already streamed before this point
setQueryData(globalThis.$TQD ?? {});
// Delete the global variable so that it doesn't get serialized again
delete globalThis.$TQD;
// From now on, insert data directly
globalThis.$TQS = setQueryData;

startClient({
  hooks: {
    wrapApp(app) {
      return (
        <QueryClientProvider client={queryClient}>{app}</QueryClientProvider>
      );
    },
    beforeStart() {
      // Do something before starting the client
    },
    extendPageContext(ctx) {
      // console.log("============= CLIENT SIDE PB  ==============",ctx.locals.pb)

    },
  },
});
