import { defineConfig } from "@openapi-codegen/cli";
import { generateSchemaTypes, generateFetchers } from "@openapi-codegen/typescript";

export default defineConfig({
  client: {
      from: {
          source: "file",
          relativePath: "./spec.json"
      },
      to: async (context) => {
          const filenamePrefix = "client";
          const { schemasFiles } = await generateSchemaTypes(context, { filenamePrefix });
          await generateFetchers(context, { filenamePrefix, schemasFiles });
      },
      outputDir: "./src/api/client",
  },
});