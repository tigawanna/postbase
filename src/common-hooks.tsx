import type { CommonHooks } from "rakkasjs";
import ErrorBoundaryComponent from "./components/navigation/ErrorBoundaryComponent";

const hooks: CommonHooks = {
  extendPageContext(ctx) {
    // Add properties to the page context,
    // especially to ctx.locals.
    // Extensions added here will be
    // available both on the server and the client.
    // Client and server `extendPageContext` hooks
    // will be called _before_ this.
  },
  wrapApp(app) {
    // Wrap the Rakkas application in some provider
    // component.
    return app
  },
  beforePageLookup(ctx, url) {
        // This will be called before the page route
    // lookup is performed.
    // - Return `false` to prevent the page from rendering.
    // - Return `{ redirect: "/some/url" }` to redirect.
    // - Return `{ rewrite: "/new/url" }` to render as if the URL was `/new/url`.
    // - Return true to continue as normal.
    return true
  },
};

export default hooks;
