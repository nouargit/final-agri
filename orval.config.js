// d:\AC\orval.config.js
module.exports = {
  main: {
    input: {
      target: "https://template-lemon-nine.vercel.app/api/spec.json",
      // You can also provide a local path to your spec file if you download it:
      // target: "./spec.json",
    },
    output: {
      mode: "single", // Changed from 'tags-and-paths' to 'single' for compatibility
      target: "./src/api/orval-client.ts", // The main output file for the client
      schemas: "./src/api/model", // Directory for generated schema types
      client: "fetch", // Orval will generate a client using the native Fetch API
      prettier: true, // Format the generated code with Prettier
      // Removed 'override.mutator' as 'custom-fetch.ts' does not exist yet

    },
  },
};