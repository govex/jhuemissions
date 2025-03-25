import { defineConfig } from 'vite'
import { reactRouter } from "@react-router/dev/vite";
import netlifyPlugin from "@netlify/vite-plugin-react-router";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), netlifyPlugin()],
})
