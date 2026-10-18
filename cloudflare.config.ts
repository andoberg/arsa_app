import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    "name": "arsa-app",
    "compatibilityDate": "2026-10-18",
    "observability": {
      "enabled": true,
      "traces": { "enabled": true }
    }
  }
});
