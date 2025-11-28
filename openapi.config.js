import { defineConfig } from "@openapi-codegen/cli";

export default defineConfig({
  client: {
    from: {
      url: "https://template-lemon-nine.vercel.app/api/spec.json",
      source: "url",
    },
    output: {
      target: "./src/api/",
      client: "openapi-fetch",
      format: "prettier",
    },
  },
});