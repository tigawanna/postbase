import { defineConfig } from "vite";
import rakkas from "rakkasjs/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(),
  rakkas({})
  ],
  server: {
    port: 3000,
    host: true
  }
});
